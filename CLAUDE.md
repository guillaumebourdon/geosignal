# Detekia — Instructions Claude Code

## Projet

Detekia (detekia.fr) est un outil de visibilité IA pour les entreprises. Next.js déployé sur Vercel. Guillaume (CEO, non-développeur) utilise Claude Code comme seul outil de développement.

**Règle absolue : chaque modification doit être vérifiée pour son impact sur TOUT le système. Grep le nom de chaque fonction/champ modifié dans tout le projet avant de committer.**

---

## Les deux produits

### 1. Audit GEO one-page (29€)
Analyse d'une seule page web. Score GEO /100, 7 critères, 7 recommandations détaillées, test de citation IA (10 requêtes GPT).

### 2. Audit GEO complet / Pro (99€)
Analyse de 10 pages clés du site. Score moyen, synthèse exécutive, 7 critères consolidés avec recommandations, patterns transverses, plan d'action (autant d'actions que justifié par l'audit), test de citation IA (30 requêtes GPT), annexe page par page avec recommandations.

---

## Flow one-page (scan gratuit → rapport payé)

```
Client entre URL sur /results ou /pricing
  ↓
/api/analyze (plan=free) → score + 7 critères (scoring déterministe, pas de Claude)
  → Résultat affiché sur /results
  → Données de scraping cachées 2h dans Redis (scrape cache)
  ↓
Client clique "Acheter le rapport" → /api/create-checkout → Stripe
  ↓
Stripe webhook → /api/webhook → /api/analyze (plan=onepage)
  → Réutilise le scrape cache si dispo (fast path, ~60s)
  → Sinon full scraping + Claude recos + 10 citations GPT (~120s)
  ↓
/api/finalize-report → stocke rapport Redis (10 ans) → email au client
  → Rapport accessible sur /r/[uuid]
```

### Fichiers impliqués (one-page)
- `pages/api/analyze.js` — Scraping + scoring + Claude recos + citation test
- `pages/api/finalize-report.js` — Stockage rapport + email client
- `pages/api/create-checkout.js` — Création session Stripe
- `pages/api/webhook.js` — Réception paiement Stripe → déclenche analyse
- `pages/api/verify-payment.js` — Vérifie si client a payé
- `pages/api/pre-check.js` — Teste si un site est auditable avant paiement
- `lib/scoring.js` — Scoring déterministe 7 critères (SOURCE UNIQUE)
- `lib/citationTest.js` — Test de citation IA via GPT-4o-mini
- `lib/reportValidator.js` — Validation du rapport avant livraison
- `lib/autoRefund.js` — Remboursement Stripe automatique si validation échoue
- `lib/oneReportTemplate.js` — Template HTML du rapport one-page
- `lib/scrapabilityCheck.js` — Vérification de scrapabilité (partagé)

---

## Flow Pro (audit 10 pages)

```
Client entre URL → pre-check → suggest-pages (20 candidates, 10 sélectionnées)
  ↓
PageSelector (client peut modifier la sélection de pages)
  ↓
Stripe checkout → webhook → /api/pro-enqueue
  → createSiteAuditJob() : enqueue 10 workers QStash (45s d'intervalle)
  → Si auto-détection : 5 pages de réserve stockées dans Redis
  ↓
/api/pro-worker × 10 (chaque worker analyse 1 page)
  → Scraping + scoring UNIQUEMENT (pas de Claude, pas de GPT)
  → ~30s par page, 0 appel API LLM
  → Stocke résultat dans Redis, incrémente compteur
  → Quand 10/10 terminés → déclenche consolidation
  ↓
/api/pro-consolidate (4 appels Sonnet en parallèle, maxDuration 600s)
  → Call 1 : Synthèse exécutive + patterns + plan d'action
  → Call 2 : Test de citation IA (30 requêtes GPT)
  → Call 3 : Analyse par critère consolidée
  → Call 4 : Recommandations par page (3-5 recos/page avec code, etc.)
  → Stocke rapport consolidé dans Redis
  → Déclenche finalisation
  ↓
/api/pro-finalize-report → génère HTML + email client
  → Rapport accessible sur /r/[uuid]
```

### Fichiers impliqués (Pro)
- `pages/api/pro-enqueue.js` — Point d'entrée, crée le job
- `lib/proQueue.js` — Gestion QStash : createSiteAuditJob(), getBackupUrl(), triggers
- `pages/api/pro-worker.js` — Worker unitaire (scraping + scoring seul)
- `lib/proPageAnalyzer.js` — Scraping + scoring d'une page (PAS de Claude/GPT)
- `pages/api/pro-consolidate.js` — Agrégation + 4 appels Sonnet + citation test
- `pages/api/pro-finalize-report.js` — Génération HTML + validation + email
- `pages/api/pro-trigger-consolidation.js` — Trigger admin manuel (DUPLIQUE la logique de pro-consolidate !)
- `pages/api/pro-status.js` — Statut d'un job Pro
- `lib/proReportTemplate.js` — Template HTML du rapport Pro
- `lib/sitemapPrioritizer.js` — Détection et priorisation des pages du site

### ⚠️ CODE DUPLIQUÉ CRITIQUE
`pro-trigger-consolidation.js` contient sa PROPRE copie de la logique de consolidation (lignes 60-240). Toute modification dans `pro-consolidate.js` DOIT être répliquée dans `pro-trigger-consolidation.js`. C'est une dette technique majeure.

---

## Contenu attendu d'un rapport Pro

1. **Couverture** — Score global /100, nombre de pages, nom du site
2. **Synthèse exécutive** — 2-3 paragraphes, top 3 forces, top 3 faiblesses
3. **7 critères consolidés** — Score moyen par critère, synthèse, recommandations détaillées (problem, solution, code, pages concernées)
4. **Patterns transverses** — 5-8 problèmes récurrents multi-pages
5. **Plan d'action** — Autant d'actions que l'audit justifie, priorisées impact/effort (pas de minimum ni maximum artificiel)
6. **Test de citation IA** — 30 requêtes GPT, taux de citation, concurrents réels
7. **Annexe page par page** — Score, 7 critères, verdict, 1 recommandation par critère non-max
8. **Méthodologie** — Explication transparente

La consolidation fait 6 étapes en 4 jobs QStash (espacés de 90s) :

| Step | Tâche | Provider principal | Fallback |
|------|-------|--------------------|----------|
| 1 | Synthèse + patterns + plan d'action | Claude Sonnet | GPT-4o |
| 2 | Critères consolidés (avant/après) | Claude Sonnet | GPT-4o |
| 3 | Citation test (30 queries) | GPT-4o-mini | — |
| 4 | Recos par page | GPT-4o | Claude Sonnet |
| 5 | Code examples | GPT-4o | — (non-bloquant) |
| 6 | QA + assemblage | GPT-4o-mini | — (non-bloquant) |

Principe : chaque step fait 1 appel API avec fallback automatique. Jamais de rate limit, jamais de timeout.

Le template est dans `lib/proReportTemplate.js`. Il lit :
- `report.pages[].recommendations` pour les recos par page (section 7)
- `recosByCriterion` agrégé depuis les pages pour les recos par critère (section 3)
- `report.patterns`, `report.actionPlan` pour sections 4-5
- `report.citationTestConsolidated` pour section 6

**Si les `recommendations` par page sont vides, les sections 3 et 7 sont vides.**

Pour les critères bien notés sans recos détaillées, le template affiche un conseil contextuel depuis `GOOD_SCORE_TIPS` (un conseil spécifique par critère). Seul un score 100% affiche "parfaitement optimisé".

---

## Scoring — 7 critères déterministes

Tout le scoring est dans `lib/scoring.js`. Aucune dépendance LLM.

| Critère | Max | Fonction |
|---------|-----|----------|
| Citabilité & réponse directe | 25 | scoreCitability() |
| Vérifiabilité & preuves | 20 | scoreVerifiability() |
| Autorité & E-E-A-T | 15 | scoreAuthority() |
| Accessibilité IA | 10 | scoreAccessibility() |
| Neutralité éditoriale | 10 | scoreNeutrality() |
| Présence externe | 10 | scoreExternalPresence() |
| Fraîcheur & signaux temporels | 10 | scoreFreshness() |

Score total = somme des 7, cap à 100. Pas de normalisation.

`analyze.js` ET `proPageAnalyzer.js` importent le même `lib/scoring.js`.

---

## Scraping — chaîne de fallback

```
Direct HTTP (15s timeout) → Browserless headless Chrome (15s) → erreur
```

**PAS DE JINA.** Supprimé définitivement (commit 6fd33cc). Ne jamais le remettre. Raison : Jina retournait du contenu variable → scores non reproductibles.

---

## Décisions verrouillées (NE PAS REVENIR DESSUS)

1. **Pas de Jina** — scraping = Direct HTTP + Browserless uniquement
2. **Scoring déterministe** — lib/scoring.js, 0 dépendance Claude
3. **Rapport HTML-first** — PDF généré depuis le HTML via PDFShift
4. **Pas d'async/polling** — scan gratuit synchrone, Pro via QStash
5. **Un seul module de scoring** — lib/scoring.js importé partout
6. **Pro = 10 pages** — marketing, code, locales alignés
7. **Workers Pro = scoring seul** — pas de Claude/GPT par page, recos générées en consolidation

---

## Clés Redis importantes

| Pattern | Contenu | TTL |
|---------|---------|-----|
| `detekia:v21:{url}:{locale}` | Cache scan gratuit | 24h |
| `detekia:scrape:{url}:{locale}` | Cache scraping intermédiaire (fast path) | 2h |
| `detekia:pro:v10:page:{url}:{locale}` | Cache page Pro | 7j |
| `detekia:pro:v1:job:{jobId}:meta` | Metadata job Pro | 24h |
| `detekia:pro:v1:job:{jobId}:page:{index}` | Résultat page Pro | 24h |
| `detekia:pro:v1:job:{jobId}:completed` | Compteur pages terminées | 24h |
| `detekia:pro:v1:job:{jobId}:consolidated` | Rapport consolidé | 7j |
| `detekia:pro:v1:job:{jobId}:status` | Statut du job | 7j |
| `detekia:report:{uuid}` | Rapport final (one-page ou Pro) | 10 ans |
| `detekia:customer:{sessionId}` | Info client Stripe | 3 ans |
| `paid:{email}` | Statut paiement | 30j |

---

## Paiement & remboursement

- Stripe embedded checkout via `create-checkout.js`
- Webhook Stripe dans `webhook.js` (vérifie signature, stocke customer info avec `paymentIntentId`)
- Remboursement auto dans `autoRefund.js` (3 retries avec backoff)
- Le `paymentIntentId` DOIT être stocké dans `detekia:customer:{sessionId}` pour que le refund fonctionne

---

## Pré-vérification avant paiement Pro

1. `pre-check.js` — teste accessibilité du site (anti-bot, contenu)
2. `suggest-pages.js` — détecte 20 pages, valide la scrapabilité des 10 premières, remplace si nécessaire (maxDuration 60s)
3. `validate-pages.js` — valide un tableau d'URLs (utilisé par PageSelector pour les pages custom)
4. `PageSelector.js` — UI de sélection de pages avec indicateurs de scrapabilité
5. Popup de vérification animée (4 étapes visuelles) dans `CheckoutFlow.js` et `results.js`

---

## i18n

- Fichiers : `locales/fr.json`, `locales/en.json`
- Hook : `lib/useTranslation.js`
- Locale détectée via `next.config.mjs` (i18n routing)
- Les noms de critères dans le code sont en français SANS accents (`Citabilite & reponse directe`)
- Les noms affichés dans le rapport sont avec accents (`Citabilité & réponse directe`)

---

## Erreurs passées à ne plus refaire

1. **Ne jamais modifier une fonction sans grep son nom dans tout le projet** — le template, les autres fichiers, les tests peuvent en dépendre
2. **Ne jamais supprimer une donnée (champ, appel API) sans vérifier qui la consomme** — grep le nom du champ dans les templates et les API
3. **pro-trigger-consolidation.js duplique pro-consolidate.js** — toute modif dans l'un doit aller dans l'autre
4. **Ne jamais lancer des tests payants sans demander** — chaque audit Pro coûte ~4€
5. **Ne jamais proposer de remettre Jina**
6. **Ne jamais augmenter un timeout comme seule solution** — chercher la cause racine
7. **Toujours deploy sur main sauf indication contraire**
8. **Si un critère n'est pas au score max, il DOIT avoir au moins une recommandation** — pas de "bien optimisé" à 8/10. Seul un 10/10 ou 25/25 peut afficher "bien optimisé"
9. **JAMAIS de limite artificielle** sur le nombre de recos, d'actions, ou de contenu. Si le site a 10 problèmes, on liste 10 recos. Les contraintes techniques ne dictent pas le contenu.

---

## Offre "Présence IA" — Monitoring de marque dans les LLMs

Projet séparé : `~/Desktop/geo-monitor/`

### Ce que ça fait
On envoie des requêtes naturelles à 4 LLMs (ChatGPT, Claude, Perplexity, Gemini) et on analyse les réponses pour mesurer la visibilité de la marque client.

### Comment lancer
```bash
cd ~/Desktop/geo-monitor
node run.js --client=<slug>                    # Run complet
node run-incremental.js --client=<slug> --run <ts>  # Incrémental
```

### Structure client
`clients/<slug>/config.json` + `queries.json`
Runs dans `clients/<slug>/runs/<timestamp>/`

### Coût : ~8€ pour 75 requêtes × 4 LLMs

### Clés API (.env) : ANTHROPIC_API_KEY, OPENAI_API_KEY, PERPLEXITY_API_KEY, GOOGLE_AI_KEY

### Présentation : `detekia.fr/deck-monitor`
### Docs : `~/Desktop/geo-monitor/docs/architecture-technique.md`
