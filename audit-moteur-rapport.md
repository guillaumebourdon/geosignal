# Audit Moteur d'Analyse & Qualité Rapport — Detekia

**Date** : 27 avril 2026
**Auditeur** : Claude Opus 4.6
**Périmètre** : Moteur gratuit + 29€ + 99€, templates rapport, validator, prompts, cache, failsafes

---

## 1. RESUME EXECUTIF

**Note de robustesse globale : 7/10**

Le moteur est fonctionnel et produit des rapports de qualité correcte dans la majorité des cas. Les prompts sont bien calibrés, le scoring heuristique est déterministe et cohérent, et les safeguards ajoutés récemment (pré-check, alerte dégradé) couvrent les cas critiques. Cependant, plusieurs risques silencieux subsistent qui peuvent produire des rapports dégradés sans alerte.

**Top 5 risques critiques :**

1. **CRITIQUE** — Le scoring heuristique est dupliqué entre `analyze.js` et `proPageAnalyzer.js` avec des divergences subtiles. Un correctif sur l'un ne se propage pas à l'autre. Un site peut obtenir un score différent entre l'audit gratuit et le Pro sur la même page.

2. **CRITIQUE** — Le validator détecte des problèmes mais ne bloque JAMAIS la livraison. Un rapport avec des erreurs graves (score incohérent, pages manquantes) est livré quand même au client. Les logs Redis ne sont pas exploités.

3. **IMPORTANT** — Le test de citation IA (10 requêtes gratuit, 30 Pro) est entièrement simulé par Claude — les requêtes NE SONT PAS réellement envoyées à ChatGPT/Perplexity. Les "concurrents cités" sont des hallucinations plausibles. Si un prospect vérifie en tapant la requête dans ChatGPT, le résultat sera différent.

4. **IMPORTANT** — Si Jina échoue ET le fetch HTML direct échoue, le scraping tombe en fallback silencieux avec un contenu vide/partiel. Le rapport est quand même généré avec des scores artificiellement bas et des recommandations génériques.

5. **IMPORTANT** — Les 3 appels Sonnet parallèles du Pro (consolidation) utilisent `Promise.allSettled`. Si 1 ou 2 échouent, le rapport est livré avec des sections vides (pas de patterns, pas de citation test, pas de critères consolidés) sans alerte au client.

**Estimation** : 3 corrections critiques + 4 importantes nécessaires avant cold mailing = ~2-3 jours de travail.

---

## 2. PROBLEMES CRITIQUES (à corriger avant cold mailing)

### C1 — Scoring dupliqué entre analyze.js et proPageAnalyzer.js

**Description** : Les 7 fonctions de scoring heuristique existent en DEUX copies indépendantes :
- `pages/api/analyze.js` lignes 62-395 (pour le gratuit/29€)
- `lib/proPageAnalyzer.js` lignes 27-131 (pour le Pro)

Les versions sont similaires mais PAS identiques. Exemples de divergences :
- `analyze.js` a des labels localisés FR/EN via l'objet `EV`. `proPageAnalyzer.js` a des labels hardcodés en FR uniquement.
- Les seuils et points attribués sont presque identiques mais des ajustements passés sur un fichier n'ont pas été propagés à l'autre.
- `analyze.js` utilise `$` (cheerio sur Jina markdown) tandis que `proPageAnalyzer.js` utilise `$html` (cheerio sur HTML direct) pour certains critères.

**Impact** : Un même site peut obtenir un score différent entre l'audit gratuit (29€) et l'audit Pro (99€) sur sa homepage. Un prospect qui compare les deux rapports perdra confiance.

**Correction** : Extraire les 7 fonctions de scoring dans un module partagé `lib/scoring.js` utilisé par les deux.

**Effort** : 3-4h

### C2 — Validator non-bloquant

**Description** : `lib/reportValidator.js` est appelé dans `finalize-report.js` et `pro-finalize-report.js`, mais les résultats sont uniquement loggués dans Redis. Même si `passed === false` (erreurs graves détectées), le rapport est livré au client.

**Code** :
```javascript
// finalize-report.js ~ligne 153
try {
  const validation = validateReport(reportData, 'onepage');
  if (!validation.passed) {
    await redis.set(`detekia:validator:${uuid}`, validation, { ex: ... });
  }
} catch (e) { console.error(...) }
// Le rapport est livré ensuite, inconditionnellement.
```

**Impact** : Un rapport avec un `score-average-mismatch` (score affiché ≠ score calculé) ou un `page-count-mismatch` est envoyé au client.

**Correction** : Si `validation.errors.length > 0`, envoyer une alerte email à Guillaume ET ajouter un flag `degraded: true` dans le rapport. Optionnellement bloquer la livraison et notifier Guillaume pour intervention manuelle.

**Effort** : 2h

### C3 — Le test de citation est simulé, pas réel

**Description** : Le `runCitationTest()` dans `analyze.js` ligne 481 et le `buildCitationPrompt()` dans `pro-consolidate.js` demandent à Claude de *simuler* les réponses de ChatGPT/Perplexity. Claude ne fait PAS de requêtes réelles aux moteurs IA.

Le prompt dit : "simule la réponse que donnerait un moteur IA" et "analyse si le site apparaît dans ta réponse".

**Impact** : Les "concurrents cités à votre place" sont des hallucinations plausibles de Claude, pas des faits vérifiables. Si un prospect tape une des requêtes dans ChatGPT, il verra probablement des résultats différents. Pour le cold mailing, c'est un risque de crédibilité.

**Options** :
- A) Clarifier dans le rapport que c'est une "simulation" (wording actuel dit "Test de visibilité IA")
- B) Implémenter un vrai test via les APIs ChatGPT/Perplexity (coûteux, complexe)
- C) Accepter le risque et ne pas changer (Claude est assez bon pour simuler)

**Recommandation** : Option A — ajouter un disclaimer discret dans le rapport "Basé sur une simulation IA des réponses probables" + renommer en "Estimation de visibilité IA" plutôt que "Test de visibilité IA".

**Effort** : 1h (option A)

---

## 3. PROBLEMES IMPORTANTS (à corriger cette semaine)

### I1 — Fallback Jina silencieux

**Description** : `analyze.js` lignes 448-460 : si Jina plante, le code tente un fetch HTML direct. Si les deux échouent, `rawContent` est vide et le code continue avec un contenu vide. Les scores seront tous très bas, les recommandations seront génériques.

**Correction** : Si le contenu est vide ou < 100 chars après scraping, throw une erreur explicite au lieu de continuer. Afficher au visiteur "Nous n'avons pas pu récupérer le contenu de cette page."

**Effort** : 1h

### I2 — Pro consolidation avec sections vides

**Description** : `pro-consolidate.js` ligne 227 utilise `Promise.allSettled`. Si le call Synthesis échoue, `synthesis = { executiveSummary: '', ... }` avec des valeurs vides. Le rapport est livré avec un résumé vide.

**Correction** : Si une des 3 sections est vide après consolidation, envoyer une alerte à Guillaume et retenter automatiquement (1 retry).

**Effort** : 2h

### I3 — Pas de timeout global sur l'audit gratuit

**Description** : `analyze.js` a `maxDuration: 120` (Vercel), mais le client-side dans `results.js` a un timeout de 90s (ligne 318). Si l'analyse prend 90-120s, le client voit "timeout" mais l'analyse continue côté serveur et le résultat est caché en Redis. Le visiteur pense que ça n'a pas marché, rafraîchit, et obtient un résultat du cache.

**Impact** : Expérience confuse. Le visiteur peut abandonner.

**Correction** : Aligner les timeouts. Ou passer au flow async (analyze-start.js + polling) qui est déjà codé mais pas utilisé par /results.

**Effort** : 1h

### I4 — Locale EN dans proPageAnalyzer.js non supportée

**Description** : Les labels de scoring dans `proPageAnalyzer.js` sont hardcodés en FR. Les audits Pro EN auront des détails de critères en français dans les sous-scores.

**Correction** : Ajouter le support locale comme dans `analyze.js` (paramètre `locale` + objet `EV`).

**Effort** : 2h

---

## 4. OPTIMISATIONS (amélioration continue)

### O1 — Cache Redis non invalidé après correction de code

Si on corrige un bug de scoring, les résultats cachés (24h gratuit, 7j Pro) ne sont pas invalidés. Un visiteur qui re-teste le même site dans les 24h obtient l'ancien résultat bugué.

### O2 — Coût Anthropic non optimisé

L'audit gratuit fait 3 appels Sonnet (analyse + citation + verdict). Le test de citation consomme ~5K tokens pour un résultat non affiché au visiteur gratuit. On pourrait le désactiver en gratuit et ne l'exécuter que pour le 29€.

Estimation coût actuel :
- Gratuit : ~$0.08-0.12 (3 Sonnet calls)
- 29€ : ~$0.08-0.12 (mêmes calls, résultat déjà caché)
- 99€ : ~$2-3 (20 × 2 calls + 3 consolidation + 1 dedup)

### O3 — Le scoring `freshness` utilise la date dans le contenu HTML

Si le scraper Jina ne retourne pas les meta dates (datePublished, dateModified), le score freshness est 0/5 même si le site est à jour. C'est un faux négatif fréquent.

### O4 — parseJson robustesse

`anthropicRetry.js` `parseJson()` utilise une regex `/\{[\s\S]*\}/` qui matche le PREMIER `{` et le DERNIER `}`. Si Claude inclut du texte JSON-like après sa réponse, la regex peut capturer un objet invalide. C'est rare mais possible.

---

## 5. AUDIT PAR DIMENSION

### Dimension 1 — Robustesse face aux sites problématiques ⚠️

| Type de site | Comportement | Risque |
|---|---|---|
| Sitemap absent | Crawler fallback → liens homepage | OK si homepage accessible |
| Sitemap mal formé | `parseSitemapUrls` regex tolerante | ⚠️ Peut manquer des URLs |
| Sitemap >50K URLs | Cap à 500 entrées (ligne 361 sitemapPrioritizer) | OK |
| SPA / JS lourd | Jina exécute JS, récupère le contenu | OK en général |
| Anti-bot (DataDome) | Pré-check bloque avant paiement | ✅ Corrigé récemment |
| Multilingue /fr /en | Locale detection + filtre par locale | OK |
| www vs non-www | `hostnameMatches()` normalise | ✅ Corrigé |
| HTTP vs HTTPS | `normalizeUrl` force HTTPS | OK |
| < 20 pages | Pré-check bloque Pro | ✅ Corrigé |
| Paywall | Non détecté — rapport sur contenu partiel | ⚠️ Risque silencieux |
| Contenu dynamique | Jina gère, mais cookies non passés | ⚠️ Contenu parfois différent |

### Dimension 2 — Qualité des prompts ✅

- Prompts bien structurés avec règles numérotées
- Vocabulary calibration en place
- Injection de signaux détectés pour éviter les faux négatifs
- Pattern ID system pour limiter le vocabulaire des recos
- Température 0.2 (déterministe) pour l'analyse, 0.3 pour la citation
- Instruction "ALREADY DETECTED ON THIS PAGE" empêche les recommandations redondantes

Point faible : aucun example few-shot dans les prompts. Claude doit inférer le format uniquement depuis les instructions.

### Dimension 3 — Validator ❌

- 6 règles implémentées, toutes pertinentes
- MAIS non-bloquant — les erreurs sont loguées et ignorées
- Les logs Redis ne sont jamais consultés (pas d'UI d'exploitation)
- Règle manquante : vérifier que le nombre de recommendations = 8 (gratuit) ou >= 8×pages (Pro)
- Règle manquante : vérifier que l'executiveSummary n'est pas vide (Pro)

### Dimension 4 — Cohérence des scores ⚠️

- Scoring heuristique déterministe et reproductible
- MAIS dupliqué entre 2 fichiers (risque de divergence → C1)
- Le neutralityScore (IA) peut varier entre 2 analyses du même site (non déterministe)
- Score total = sum(7 heuristiques) + neutralityBonus (-3 à +3), cappé à 100. Logique cohérente.
- Les chiffres du rapport (pages analysées, requêtes testées) viennent du code, pas de l'IA → OK

### Dimension 5 — Test de visibilité IA ⚠️

- Les requêtes sont simulées par Claude, pas réellement testées (→ C3)
- Le système de sélection des 2 meilleures requêtes (results.js) est robuste
- L'identification des concurrents est plausible mais non vérifiable
- Si Claude timeout sur la citation, `citationTest` est null → la section ne s'affiche pas (OK)
- Gratuit = 10 requêtes, Pro = 30 requêtes : cohérent

### Dimension 6 — Patterns transverses (Pro) ✅

- Le prompt demande 5-8 patterns avec pagesAffected
- Le validator vérifie ≥2 pages par pattern
- Le tri du plan d'action est déterministe (impact/effort)
- La dedup Sonnet en finalization fusionne les recommandations sémantiquement identiques
- Risque résiduel : Claude peut inventer des patterns qui ne correspondent pas aux données réelles

### Dimension 7 — Rapport HTML et PDF ✅

- Template HTML bien structuré, responsive
- PDF via PDFShift — dépendance externe
- Bouton "Télécharger PDF" appelle `/api/report-pdf` qui génère à la volée
- Liens internes fonctionnels (ancres)
- Caractères spéciaux gérés (accents, emojis)
- Non testé : rapport avec 0 recommandations (cas théorique)

### Dimension 8 — Gestion des erreurs ⚠️

| Scénario | Comportement | Verdict |
|---|---|---|
| Jina plante | Fallback HTML direct | ⚠️ Si les 2 échouent, contenu vide → rapport dégradé |
| Anthropic 429 | Retry avec backoff (max 60s, 3 retries) | ✅ OK |
| Anthropic timeout | Error propagée → résultat error | ✅ OK |
| Redis plante | try/catch sur chaque opération | ✅ OK (graceful) |
| QStash miss | Retries QStash (3 retries built-in) | ✅ OK |
| pro-worker fail 1/20 | Page stockée avec error, consolidation continue | ⚠️ Pas d'alerte, rapport dégradé |
| pro-consolidate fail | Sections vides dans le rapport | ❌ Livré sans alerte |
| Client paie, pas de rapport | Webhook → pro-enqueue → 20 workers → consolidate → finalize | ⚠️ Si une étape échoue silencieusement, pas de recovery |
| Alerte Guillaume | Alerte si <5 pages trouvées (webhook) | ✅ Récemment ajouté |

### Dimension 9 — Cohérence FR/EN ⚠️

- Prompts FR bien calibrés, prompts EN corrects
- `analyze.js` : locale passée partout, labels EV bilingues ✅
- `proPageAnalyzer.js` : labels FR uniquement ❌ (→ I4)
- Templates email bilingues ✅
- Dates formatées par locale ✅
- Citation test : requêtes générées dans la langue du site ✅

### Dimension 10 — Performance et coût ✅

- Gratuit : ~30-60s, ~$0.10
- 29€ : ~1min (résultat déjà caché si gratuit fait avant), ~$0.00 additionnel
- 99€ : ~15-20min, ~$2-3
- Cache Redis bien utilisé (24h gratuit, 7j Pro)
- Pas de boucle infinie détectée
- QStash stagger (20s entre workers) prévient le rate limiting

---

## 6. CARTOGRAPHIE DES RISQUES

| Type de site | Moteur OK ? | Risques | Mitigation |
|---|---|---|---|
| Site standard avec sitemap | ✅ | Aucun | - |
| Site e-commerce (Shopify, WooCommerce) | ✅ | Sitemap parfois filtré | Crawler fallback |
| Blog WordPress | ✅ | Aucun | - |
| SaaS avec app JS | ⚠️ | Jina peut ne pas rendre tout le JS | Fallback HTML |
| Site anti-bot (DataDome) | ✅ | Bloqué par pré-check | Pré-check en place |
| Site < 20 pages | ✅ | Pro bloqué, one-page OK | Pré-check |
| Site paywall | ⚠️ | Rapport sur contenu partiel | Aucune |
| Site multilingue | ✅ | Locale filtrée correctement | sitemapPrioritizer |
| Site avec www/non-www | ✅ | Normalisé | hostnameMatches() |
| Site très lent (>10s) | ⚠️ | Timeout Jina (20s) | Retry non implémenté |
| Site avec redirect chains | ⚠️ | fetch suit les redirects | Limite de 20 redirects par défaut |

---

## 7. PLAN DE CORRECTION RECOMMANDÉ

### Priorité 1 — Avant cold mailing (2-3 jours)

1. **C2 — Validator bloquant** : Si errors > 0, alerte email + flag rapport. 2h.
2. **C1 — Scorer partagé** : Extraire les 7 fonctions dans `lib/scoring.js`. 3-4h.
3. **C3 — Disclaimer citation** : Ajouter "Simulation IA" dans le wording. 1h.
4. **I1 — Fallback Jina** : Erreur explicite si contenu vide. 1h.

### Priorité 2 — Cette semaine

5. **I2 — Pro consolidation retry** : Retry automatique si section vide. 2h.
6. **I4 — Locale EN dans proPageAnalyzer** : Ajouter support bilingue. 2h.
7. **I3 — Timeout client/serveur** : Aligner à 90s. 1h.

### Priorité 3 — Amélioration continue

8. O1 — Invalidation cache après fix
9. O2 — Désactiver citation test en gratuit
10. O3 — Améliorer détection freshness
11. O4 — Robustesse parseJson

---

## 8. POINTS DE VIGILANCE POUR GUILLAUME

1. **Le test de citation est une simulation.** C'est le point le plus sensible pour le cold mailing. Les concurrents cités dans le rapport ne sont PAS vérifiés en temps réel. Si un prospect curieux vérifie, il trouvera un résultat différent. Guillaume doit décider : disclaimer ou pas ?

2. **Le validator ne bloque rien.** Aujourd'hui, même un rapport avec un score incohérent est livré. C'est un choix architectural à confirmer : mieux vaut un rapport imparfait livré vite, ou un rapport bloqué en attente de review manuelle ?

3. **Le scoring dupliqué est une dette technique active.** Chaque correction de scoring future devra être faite dans 2 fichiers. C'est une source de bugs garantie à moyen terme.

4. **Les rapports Pro existants avec 1 page** (bug celio.com corrigé) : vérifier dans l'historique si d'autres rapports ont été affectés. Les rapports Pro livrés sont dans Redis avec une TTL de 10 ans — ils restent accessibles.

5. **Le coût Anthropic de l'audit gratuit** ($0.10/audit) est élevé pour un funnel gratuit. Si le cold mailing génère 1000 audits gratuits, ça fait $100 en API. À surveiller.
