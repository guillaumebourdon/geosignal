# Audit Cohérence Complète du Contenu Site — Detekia

**Date** : 27 avril 2026
**Périmètre** : Toutes les pages, emails, rapports, blog (échantillon)

---

## 1. RÉSUMÉ EXÉCUTIF

**Note de cohérence globale : 7/10**

Le site a beaucoup évolué depuis le dernier audit. Les CGU et la politique de confidentialité ont été mis à jour (remboursement auto, sous-traitants). Mais de nouvelles incohérences sont apparues, principalement autour du passage aux "vraies requêtes ChatGPT" et des chiffres de requêtes IA qui ne correspondent plus au code.

**Top 5 problèmes critiques :**

1. **FAUX** — Pricing free card dit "Test IA (3 requêtes)" mais le code en exécute **2** (analyze.js ligne 649). Incohérence visible par un visiteur qui paye et compare.

2. **CONTRADICTOIRE** — Page /methodologie : le subtitle dit "±5 points" pour la neutralité (ligne 483) mais la note de normalisation dit "-3 à +3 points" (ligne 688). Le code fait -3 à +3.

3. **IMPRÉCIS** — Stats banner "4 moteurs IA testés" : le test de citation ne query que GPT-4o-mini (1 moteur). Le chiffre "4" fait référence aux moteurs sur lesquels les 8 critères sont calibrés, pas au test de citation. Confusion possible.

4. **FAUX** — Pricing modal 29€ dit "rapport en 30 secondes après paiement" (ligne 829). En réalité, le flow 29€ prend ~1 minute (même si l'analyse est cachée du gratuit, la finalization prend 30-60s).

5. **TÉMOIGNAGES NON VÉRIFIÉS** — 3 témoignages avec noms, entreprises, métriques spécifiques. Aucun marqueur verified/fictional. Si un prospect vérifie et ne trouve pas "Thomas L. de Kairos SaaS", la crédibilité s'effondre.

---

## 2. PROBLÈMES PAR PAGE

### Homepage (/)

**Affirmations validées (VRAI)** : 8 critères ✅, scoring /100 ✅, analyse en <60s (gratuit) ✅, FR+EN ✅

**Incohérences** :
- **Stats "4 moteurs IA testés"** : IMPRÉCIS. Le test de citation n'utilise que GPT-4o-mini. "4 moteurs" fait référence à ChatGPT/Claude/Gemini/Perplexity sur lesquels la méthodologie est calibrée.
- **Stats "30 requêtes IA (audit Pro)"** : VRAI (code confirme 30 dans pro-consolidate.js)
- **Stats "10 ans rapport accessible"** : VRAI (REPORT_TTL = 10 ans)
- **Report section "Comparatif avec 3 concurrents"** : IMPRÉCIS. Le test de citation extrait TOUS les concurrents mentionnés, pas exactement 3.
- **Report section "Requêtes testées sur 4 moteurs IA"** : FAUX. Seulement GPT-4o-mini.

**Témoignages** :
- Thomas L. / Kairos SaaS : non vérifiable
- Marine G. : non vérifiable
- Julien B. / Maison Verdure : non vérifiable
Aucun disclaimer "cas illustratifs" ou "exemples fictifs".

### /pricing

**Incohérences** :
- **Free card "Test IA (3 requêtes)"** : FAUX. Le code exécute 2 requêtes ChatGPT réelles (analyze.js:649).
- **Modal 29€ "rapport en 30 secondes après paiement"** : FAUX/IMPRÉCIS. Le flow prend ~1 minute.
- **FAQ pricing "L'audit gratuit : environ 30 secondes"** : VRAI pour le scoring, mais le test de citation ajoute ~10-15s.

### /pro

**Affirmations validées** : 20 pages ✅, 15-20 min ✅, 30 requêtes ✅, méthodologie évolutive ✅

**Incohérences** :
- **"ChatGPT, Gemini et Perplexity sur 30 requêtes"** : IMPRÉCIS. Seul GPT-4o-mini est interrogé, pas Gemini ni Perplexity.

### /one-page

**Affirmations validées** : 1 min ✅, 10 requêtes ✅, score /100 ✅, PDF ✅

**Incohérence** :
- **"Test IA sur 10 requêtes"** : VRAI pour le payant, mais la version gratuite montre 2 requêtes (pas 10).

### /methodologie

**Incohérences** :
- **"±5 points"** (subtitle ligne 483) vs **"-3 à +3 points"** (note ligne 688) : CONTRADICTOIRE. Le code fait -3 à +3.
- **Tableau comparatif "Test IA : Partiel"** pour le gratuit : VRAI mais vague.
- **"10 pts" pour Neutralité** dans le score grid vs "±3 pts ajustement" dans la note : logiques différentes (le score brut est sur 10 points, le bonus est ±3 sur le total). Potentiellement confus.

### /a-propos

**Cohérent** : Beeleven SASU ✅, fondateur ✅, principes cohérents ✅, CTA vers /methodologie ✅.

### /results

**Cohérent** : Double CTA 29€/99€ ✅, citation test avec 2 requêtes visibles ✅, section verrouillée ✅.

### /cgu

**MIS À JOUR** : Remboursement auto ✅, délais de livraison ✅. "Satisfait ou remboursé" retiré ✅.
- **"29 € TTC"** mentionné (ligne 1092) : vérifier que c'est bien TTC (Beeleven est en franchise de TVA ? Si micro-entreprise/SASU < seuil, c'est HT = TTC).

### /confidentialite

**MIS À JOUR** : Sous-traitants complets ✅ (Anthropic, OpenAI, Jina, PDFShift, Upstash ajoutés).
- "URL analysée et résultats : 24 heures" : IMPRÉCIS pour les rapports payants (10 ans).

---

## 3. PROBLÈMES TRANSVERSES

### Nombre de requêtes IA incohérent entre les pages

| Source | Gratuit | 29€ | 99€ |
|---|---|---|---|
| Code réel | 2 | 10 | 30 |
| /pricing free card | **3** ❌ | 10 ✅ | 30 ✅ |
| /pricing FAQ | — | — | — |
| /methodologie tableau | "Partiel" | 10 ✅ | 30 ✅ |
| Homepage stats | — | — | 30 ✅ |

**Action** : Corriger pricing free card de "3" à "2", ou ajuster le code pour en faire 3.

### "4 moteurs IA" vs réalité

Le site mentionne "4 moteurs IA testés" (homepage stats), "Requêtes testées sur 4 moteurs IA" (homepage report section), "ChatGPT, Gemini et Perplexity" (pro features). En réalité, seul GPT-4o-mini est interrogé pour le test de citation. Les 4 moteurs (ChatGPT, Claude, Gemini, Perplexity) sont ceux sur lesquels la **méthodologie de scoring** est calibrée.

**Action** : Clarifier. "4 moteurs IA analysés" → "Méthodologie calibrée sur 4 moteurs IA" ou "Test de visibilité IA sur ChatGPT".

### Mention "Princeton/KDD 2024" vs "méthodologie évolutive"

Certaines pages disent "Princeton/KDD 2024" spécifiquement, d'autres disent "méthodologie évolutive et sourcée". La transition est inégale.

| Page | Wording |
|---|---|
| /methodologie sources | "Aggarwal et al., KDD 2024" (spécifique) ✅ |
| /methodologie note | "étude fondatrice de Princeton" ✅ |
| /pro features | "Méthodologie évolutive et sourcée" ✅ |
| /one-page features | "Méthodologie évolutive et sourcée" ✅ |
| /pricing subtitle | "méthodologie sourcée et enrichie en continu" ✅ |
| /a-propos | "étude Princeton/KDD 2024" (spécifique) |

**Verdict** : Cohérent. /methodologie est spécifique (c'est la page technique), les autres sont évolutifs.

---

## 4. CHIFFRES À VÉRIFIER

| Chiffre | Où | Statut | Réalité code |
|---|---|---|---|
| 8 critères GEO | Partout | ✅ VRAI | 7 heuristiques + 1 IA = 8 |
| Score /100 | Partout | ✅ VRAI | Cappé à 100 |
| 20 pages Pro | /pro, /pricing | ✅ VRAI | maxUrls=20 dans proQueue.js |
| 30 requêtes Pro | /pro, stats | ✅ VRAI | queryCount=30 dans pro-consolidate.js |
| 10 requêtes 29€ | /one-page, /pricing | ✅ VRAI | queryCount=10 pour le payant |
| **3 requêtes gratuit** | **/pricing free card** | **❌ FAUX** | **Code fait 2 (analyze.js:649)** |
| 4 moteurs IA | Homepage stats | ⚠️ IMPRÉCIS | 1 moteur pour citation, 4 pour la méthodo |
| Rapport 10 ans | Multiple | ✅ VRAI | REPORT_TTL = 10 ans |
| 1 min one-page | /one-page, CGU | ✅ VRAI | ~1 min confirmé |
| 15-20 min Pro | /pro, CGU | ✅ VRAI | Vérifié en conditions réelles |
| 30 sec gratuit | /pricing | ⚠️ IMPRÉCIS | ~30-60s selon le site |
| 30 sec après paiement 29€ | Pricing modal | ❌ FAUX | ~1 min (finalization + email) |
| ±5 pts neutralité | /methodologie subtitle | ❌ FAUX | Code fait ±3 |
| -3 à +3 pts | /methodologie note | ✅ VRAI | Confirmé par le code |
| 810M ChatGPT users | /results loading | NON VÉRIFIABLE | Source: Superlines 2026 |
| 80% URLs pas top 100 | /results loading | NON VÉRIFIABLE | Source: Ahrefs 2025 |
| 527% trafic IA | — (retiré) | — | Était dans l'ancien /a-propos |
| Comparatif 3 concurrents | Homepage report | ⚠️ IMPRÉCIS | Nombre variable de concurrents |

---

## 5. CRÉDIBILITÉ — POINTS D'ALERTE

### Témoignages non vérifiés

Les 3 témoignages sont présentés comme de vrais retours clients avec :
- Noms (Thomas L., Marine G., Julien B.)
- Entreprises (Kairos SaaS, Maison Verdure)
- Métriques (score 29→58, +29 pts en "une semaine")

**Risque** : Un prospect SEO curieux pourrait chercher "Kairos SaaS" ou "Maison Verdure" et ne rien trouver. Impact crédibilité : CRITIQUE.

**Options** :
- A) Remplacer par de vrais témoignages (demander aux premiers clients)
- B) Ajouter un disclaimer "Cas illustratifs basés sur des audits réels"
- C) Retirer les témoignages jusqu'à ce qu'on ait des vrais

### Stats loading screen

8 stats affichées pendant le chargement (/results) avec des sources (Ahrefs 2025, Otterly.AI 2026, etc.). Ces sources sont crédibles et cohérentes avec le secteur. Non vérifiable individuellement mais l'ensemble est plausible.

---

## 6. PROMESSES NOUVELLES À VALORISER

### Vraies requêtes ChatGPT (GPT-4o-mini)
**Où c'est valorisé** : Nulle part explicitement. Le site dit "Test de visibilité IA" sans préciser que ce sont de VRAIES requêtes.
**Où ça devrait être** : /pricing (différenciateur fort vs concurrents), /one-page, /pro, /results, homepage report section.
**Wording suggéré** : "Nous interrogeons réellement ChatGPT sur vos requêtes métier" ou "Requêtes IA réelles, pas de simulation".

### Remboursement automatique
**Où c'est valorisé** : CGU ✅, email auto-refund ✅
**Où ça manque** : /pricing (argument commercial fort de réassurance), /pro, /one-page
**Wording suggéré** : Petit badge "Remboursement automatique si le rapport n'est pas livré" sous les CTA d'achat.

### Pré-check d'auditabilité
**Où c'est valorisé** : Nulle part (invisible pour l'utilisateur — c'est le point).
**Opportunité** : Mentionner "Nous vérifions que votre site est auditable avant le paiement" comme signal de sérieux sur /pricing ou /pro.

---

## 7. PRIORISATION DES CORRECTIONS

### CRITIQUE (avant cold mailing)

| # | Correction | Effort |
|---|---|---|
| 1 | Pricing free "3 requêtes" → "2 requêtes" (ou ajuster le code à 3) | 5 min |
| 2 | Methodologie "±5 points" → "±3 points" | 5 min |
| 3 | Pricing modal "30 secondes" → "1 minute" | 5 min |
| 4 | "4 moteurs IA testés" → wording plus précis | 15 min |
| 5 | "Requêtes testées sur 4 moteurs IA" → "Test réel sur ChatGPT" | 5 min |
| 6 | Témoignages : ajouter disclaimer ou remplacer | 30 min |

### IMPORTANT (cette semaine)

| 7 | Confidentialité "24h" → préciser "rapports payants : 10 ans" | 10 min |
| 8 | "Comparatif avec 3 concurrents" → retirer le "3" | 5 min |
| 9 | Valoriser "vraies requêtes ChatGPT" sur /pricing et landing pages | 30 min |
| 10 | Valoriser "remboursement auto" sur /pricing | 15 min |

### OPTIMISATION (backlog)

| 11 | Harmoniser le wording Princeton sur toutes les pages | 20 min |
| 12 | Ajouter de vrais témoignages clients | Dépend de Guillaume |
| 13 | Mentionner le pré-check comme argument de sérieux | 15 min |
