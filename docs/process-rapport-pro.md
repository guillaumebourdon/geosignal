# Process complet : comment se construit un rapport Pro Detekia

## Vue d'ensemble

Un client paye 99€ pour un audit GEO de 10 pages. Le rapport doit contenir :
- Score global + synthèse exécutive + lecture business
- 7 critères consolidés avec recos, avant/après, guides techniques
- Patterns transverses (problèmes récurrents)
- Plan d'action dédupliqué
- Test de citation IA (30 requêtes réelles envoyées à ChatGPT)
- Code examples JSON-LD/HTML pour les recos critiques
- Annexe page par page (score + 3 recos par page)
- QA automatique (vérification cohérence)
- Méthodologie transparente

---

## Les outils et leurs contraintes

### Vercel (hébergement)
- **maxDuration** : 600s max par fonction serverless (plan Pro)
- Si la fonction dépasse 600s → 504 Gateway Timeout, tout est perdu
- Chaque fonction est indépendante (pas de mémoire partagée)

### Anthropic Claude Sonnet (génération de texte)
- **Rate limit Niveau 2** : 1000 requêtes/min, 450K tokens input/min, 90K tokens output/min
- **Timeout SDK** : configuré à 500s dans notre code
- **Comportement observé** : 3 appels en parallèle passent toujours. Le 4ème en rafale échoue ~50% du temps (probablement throttling interne même sous le rate limit officiel)
- **Coût** : ~$3/M tokens input, ~$15/M tokens output. Un rapport Pro coûte ~0.30€

### OpenAI GPT-4o-mini (test de citation)
- **Rate limit** : très généreux (pas de problème observé)
- **Timeout** : 20s par query
- **30 queries en parallèle** : fonctionne sans problème
- **Coût** : ~0.03€ pour 30 queries

### QStash (file d'attente)
- **Retries** : 3 retries automatiques avec backoff exponentiel
- **Delay** : peut programmer un délai avant exécution (ex: 45s, 60s)
- **Fiabilité** : très haute — jamais de perte de message observée
- **Limite** : les retries arrivent parfois après 10+ min

### Upstash Redis (stockage)
- **TTL** : on utilise 24h pour les données de job, 7j pour les rapports consolidés, 10 ans pour les rapports finaux
- **Taille max par clé** : 100MB (largement suffisant)
- **Fiabilité** : très haute, sauf timeout réseau rare (~1/1000)

### Browserless (scraping headless)
- **Timeout** : 15s + 5s buffer = 20s par page
- **Free tier** : 1000 sessions/mois
- **Fiabilité** : ~90% — certains sites JS-heavy timeout

### PDFShift (génération PDF)
- **Timeout** : 50s
- **Fiabilité** : haute

---

## Le process actuel (et ses problèmes)

### Étape 1 : Paiement + lancement (0-5s)
```
Client paye sur Stripe → webhook → pro-enqueue → QStash
```
**Fichiers** : webhook.js → proQueue.js → pro-enqueue.js
**Contrainte** : le webhook Stripe doit répondre en <60s
**Pas de problème connu**

### Étape 2 : Analyse des 10 pages (0-8 min)
```
QStash envoie 10 jobs espacés de 45s → pro-worker × 10
Chaque worker : scraping (Direct HTTP → Browserless) + scoring déterministe
```
**Fichiers** : pro-worker.js → proPageAnalyzer.js → lib/scoring.js
**Contrainte** : chaque worker a 300s max, mais le scoring prend ~30s
**Espacement 45s** : évite tout rate limit (0 appel API LLM dans les workers)
**Fiabilité** : ~95% — les échecs viennent du scraping (anti-bot, site hors ligne)
**Backup pages** : si une page échoue et c'est de l'auto-détection, une page de réserve est lancée

**PAS DE PROBLÈME ICI — ça marche à 100% quand le site est accessible**

### Étape 3 : Consolidation (le problème est ICI)
```
Quand 10/10 pages sont terminées → QStash déclenche pro-consolidate
pro-consolidate fait 6 appels Sonnet :
  1. Synthèse + patterns + plan d'action
  2. Citation test (30 queries GPT)
  3. Critères consolidés
  --- cooldown 30s ---
  4. Recos par page (3 par page)
  --- cooldown 5s ---
  5. Code examples (5 recos critiques)
  --- cooldown 3s ---
  6. QA automatique
```
**Fichier** : pro-consolidate.js (maxDuration 600s, SDK timeout 500s)

**LE PROBLÈME** : Tout est dans UNE SEULE fonction Vercel.
- Les 3 premiers appels en parallèle prennent 60-120s
- Le 4ème appel (recos par page) échoue ~50% du temps
- Quand il échoue, le rapport sort sans recos = inutilisable
- Le retry (ajouté récemment) aide mais ne garantit pas 100%
- Si le total dépasse 600s → tout est perdu (504 Vercel)

**C'est le SEUL point de défaillance de tout le système.**

### Étape 4 : Finalisation (30-60s)
```
pro-consolidate stocke le rapport en Redis → déclenche pro-finalize-report
pro-finalize-report : génère le HTML, valide, stocke, envoie l'email
```
**Fichiers** : pro-finalize-report.js → proReportTemplate.js
**Contrainte** : maxDuration 120s
**Lock d'idempotence** : SET NX avec TTL 24h pour éviter double email

**PAS DE PROBLÈME ICI — si la consolidation réussit, la finalisation marche**

### Étape 5 : Rendu web
```
Client clique le lien dans l'email → /r/[uuid]
Le rendu est dans pages/r/[uuid].jsx (React SSR)
Lit les données depuis Redis, applique softenText, affiche le rapport
```
**PAS DE PROBLÈME ICI**

---

## Ce qui marche à 100%

| Composant | Fiabilité | Pourquoi |
|-----------|-----------|----------|
| Workers de pages (10×) | ~100% | 1 job = 1 page = 30s. Espacés de 45s. 0 appel LLM. |
| Test de citation GPT | ~100% | 30 queries GPT-4o-mini en parallèle, 20s timeout chacune |
| Finalisation | ~100% | Lit Redis, génère HTML, envoie email. Pas d'appel LLM. |
| Rendu web | 100% | Lit Redis, affiche React. |
| Scoring | 100% | Code déterministe, pas de LLM. |

## Ce qui échoue parfois

| Composant | Fiabilité | Pourquoi |
|-----------|-----------|----------|
| Consolidation (6 appels Sonnet en 1 fonction) | ~60-70% | Rate limit/timeout sur le 4ème+ appel |
| Scraping (certains sites) | ~90% | Anti-bot, JS-heavy |

---

## La solution proposée : consolidation en jobs séparés

### Principe
Au lieu de faire 6 appels Sonnet dans 1 fonction de 600s, on fait 6 jobs QStash séparés, chacun avec 1 seul appel Sonnet, espacés de 60s.

C'est exactement le même principe que les workers de pages (qui marchent à 100%).

### Nouveau flow

```
Étape 2 terminée (10/10 pages)
  ↓
Job consolidation-1 : Synthèse + patterns + plan d'action (1 appel Sonnet)
  → Stocke dans Redis : {jobId}:synthesis
  ↓ 60s (QStash delay)
Job consolidation-2 : Critères consolidés (1 appel Sonnet)
  → Stocke dans Redis : {jobId}:criteria
  ↓ 60s
Job consolidation-3 : Citation test (30 appels GPT-4o-mini)
  → Stocke dans Redis : {jobId}:citations
  ↓ 60s
Job consolidation-4 : Recos par page (1 appel Sonnet)
  → Stocke dans Redis : {jobId}:page-recos
  ↓ 60s
Job consolidation-5 : Code examples (1 appel Sonnet)
  → Stocke dans Redis : {jobId}:code-examples
  ↓ 60s
Job consolidation-6 : QA + assemblage
  → Lit tous les résultats depuis Redis
  → Assemble le rapport consolidé
  → Stocke dans Redis : {jobId}:consolidated
  → Déclenche la finalisation
```

### Pourquoi ça marchera

- **1 appel Sonnet par job** : jamais de rate limit (le rate limit est 1000 req/min, on fait 1 req toutes les 60s)
- **60s entre chaque job** : cooldown naturel, aucun risque de throttling
- **maxDuration 300s par job** : largement suffisant pour 1 appel (même avec retry)
- **QStash retry** : si un job échoue, QStash le relance automatiquement
- **Pas de dépendance entre jobs** : chaque job lit les données de Redis (pages) et écrit son résultat
- **Le job 6 (assemblage) ne fait AUCUN appel API** : il lit 5 résultats Redis et les combine

### Temps total
6 jobs × 60s d'intervalle + ~60s d'exécution chacun = ~7-8 min
Ajouté aux 8 min des workers = **~15-16 min total**
C'est acceptable — le client reçoit déjà un email "en cours" après le paiement.

### Impact sur les fichiers existants

| Fichier | Impact |
|---------|--------|
| pro-consolidate.js | REFACTORER — éclater en 6 endpoints ou 1 endpoint avec action param |
| pro-trigger-consolidation.js | Adapter les actions admin |
| proQueue.js | Ajouter les 6 triggers QStash séparés |
| pro-finalize-report.js | PAS DE CHANGEMENT — il lit toujours {jobId}:consolidated |
| proReportTemplate.js | PAS DE CHANGEMENT — il reçoit le même objet |
| pages/r/[uuid].jsx | PAS DE CHANGEMENT — il lit le même objet |
| pro-worker.js | PAS DE CHANGEMENT — il stocke toujours les pages |

### Risques
- **Complexité** : 6 jobs au lieu de 1 = plus de plomberie QStash
- **Temps total** : 15-16 min au lieu de 13 min
- **Si un job intermédiaire échoue définitivement** : le rapport est bloqué. Mais QStash retry 3 fois, donc c'est très improbable.

---

## Résumé des coûts par rapport

| Composant | Appels | Coût |
|-----------|--------|------|
| 10 workers (scoring seul) | 0 appel LLM | 0€ |
| Synthèse Sonnet | 1 appel (~5K in, 5K out) | ~0.09€ |
| Critères Sonnet | 1 appel (~3K in, 4K out) | ~0.07€ |
| Citation test GPT | 30 appels (~6K in, 12K out) | ~0.01€ |
| Recos par page Sonnet | 1 appel (~3K in, 5K out) | ~0.09€ |
| Code examples Sonnet | 1 appel (~1K in, 2K out) | ~0.03€ |
| QA Sonnet | 1 appel (~2K in, 1K out) | ~0.02€ |
| **Total** | **5 Sonnet + 30 GPT** | **~0.31€** |

---

## Contraintes à respecter pendant le refactoring

1. **Ne pas toucher** : pro-finalize-report.js, proReportTemplate.js, pages/r/[uuid].jsx, pro-worker.js, proPageAnalyzer.js, lib/scoring.js
2. **Le rapport consolidé final doit avoir exactement la même structure** qu'aujourd'hui (sinon le template et le rendu web cassent)
3. **Tester chaque job individuellement** avant de les chaîner
4. **Garder le trigger admin** pour pouvoir relancer un job individuel en cas d'échec
5. **Ne pas supprimer l'ancien pro-consolidate.js** tant que le nouveau n'est pas validé
