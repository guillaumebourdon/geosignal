# Audit Flow de Paiement & Infrastructure — Detekia

**Date** : 27 avril 2026
**Périmètre** : Stripe, Vercel, Redis, QStash, Resend, PDFShift, Jina, Anthropic, OpenAI + toutes les routes API

---

## 1. RÉSUMÉ EXÉCUTIF

**Note de robustesse globale : 7.5/10**

Le flow de paiement est fonctionnel et sécurisé (signature webhook Stripe vérifiée, rate limiting en place, auto-refund câblé). Les principales faiblesses sont dans la gestion des cas limites : validation trop permissive du montant webhook, secrets admin passés en query string, et absence de corrélation ID pour tracer les jobs Pro à travers QStash.

**Top 5 risques critiques :**

1. **CRITIQUE** — Validation montant webhook trop permissive (`amount >= 900` au lieu de match exact). Un paiement de 9,01€ serait traité comme valide.
2. **CRITIQUE** — Secrets admin (`DELETE_REPORT_SECRET`, `PRO_ADMIN_SECRET`) passés en query string — visibles dans les logs serveur et l'historique navigateur.
3. **IMPORTANT** — Webhook non idempotent : si Stripe envoie le webhook 2 fois, le Pro audit est déclenché 2 fois (coût API doublé + rapport potentiellement dupliqué).
4. **IMPORTANT** — Le webhook n'a pas de `maxDuration` explicite — le défaut Vercel (10s pour Hobby, 60s pour Pro) peut être insuffisant si `createSiteAuditJob` prend du temps.
5. **IMPORTANT** — Pas de corrélation ID entre le paiement Stripe, le job QStash, et le rapport final. En cas de problème, impossible de tracer la chaîne complète.

**Estimation : sur 1000 paiements, ~2-3 cas problématiques** (principalement des timeouts Anthropic ou des doublons webhook). Avec les safeguards en place (pré-check + auto-refund), les cas critiques sont couverts.

---

## 2. PROBLÈMES CRITIQUES (à corriger avant cold mailing)

### C1 — Validation montant webhook trop permissive

**Description** : `webhook.js` ligne 38 vérifie `amount >= 900` (≥9€) pour considérer un paiement comme valide. Tout paiement >9€ déclenche le flow.

**Code** : `pages/api/webhook.js:38`
```javascript
if (email && (amount >= 900 || plan === 'pro'))
```

**Cas problématique** : Un coupon partiel qui ramène le prix à 15€ serait traité comme un achat valide, mais le plan serait potentiellement mal identifié (rapport vs pro).

**Impact** : Risque faible en pratique (les prix sont contrôlés par Stripe), mais la logique n'est pas robuste.

**Correction** : Valider le plan depuis `session.metadata.plan` (déjà disponible) plutôt que d'inférer depuis le montant. Le montant ne devrait être qu'une vérification de cohérence.

**Effort** : 30 min

### C2 — Secrets admin en query string

**Description** : `delete-report.js` et `pro-trigger-consolidation.js` utilisent `req.query.secret` pour l'authentification admin.

**Code** :
- `pages/api/delete-report.js:8` : `const { id, secret } = req.query`
- `pages/api/pro-trigger-consolidation.js:26` : `const adminSecret = req.query.secret`

**Cas problématique** : Les query strings apparaissent dans les access logs Vercel, l'historique navigateur, et les logs réseau. Si un log est exposé, les secrets sont compromis.

**Impact** : Un attaquant avec le secret peut supprimer des rapports ou relancer des consolidations. Risque modéré (endpoints peu visibles).

**Correction** : Passer les secrets dans le header `Authorization: Bearer <secret>` ou dans le body POST.

**Effort** : 1h

### C3 — Webhook non idempotent pour le Pro

**Description** : Si Stripe envoie le webhook `checkout.session.completed` 2 fois (ce qui arrive lors de retries), `createSiteAuditJob` est appelé 2 fois → 2 audits Pro lancés pour le même paiement.

**Code** : `pages/api/webhook.js:50-67` — aucune vérification d'unicité du `session.id` avant de lancer le job.

**Cas problématique** : Panne réseau temporaire → Stripe retry le webhook → double facturation API (40+ appels Anthropic au lieu de 20).

**Impact** : Coût doublé (~$4-6 supplémentaire) + le client peut recevoir 2 rapports + confusion.

**Correction** : Vérifier dans Redis si le `session.id` a déjà été traité (SET NX avec TTL 24h). Si oui, skip.

**Effort** : 30 min

---

## 3. PROBLÈMES IMPORTANTS (à corriger cette semaine)

### I1 — maxDuration manquant sur webhook.js

**Description** : Pas de `export const config = { maxDuration: ... }` dans webhook.js. Le défaut Vercel est 10s (Hobby) ou 60s (Pro). Si `createSiteAuditJob` prend plus de 10s (sitemap parsing), le webhook timeout et Stripe retry.

**Correction** : Ajouter `export const config = { maxDuration: 60 }`.

**Effort** : 5 min

### I2 — Pas de corrélation ID

**Description** : Le `session.id` Stripe, le `siteJobId` QStash, et le `uuid` du rapport sont 3 identifiants indépendants. Impossible de tracer la chaîne complète sans fouiller manuellement dans Redis.

**Correction** : Stocker le `session.id` Stripe dans les métadonnées du job Redis et dans le rapport final.

**Effort** : 1h

### I3 — Email d'alerte Guillaume à chaque analyse gratuite

**Description** : `analyze.js` envoie un email de notification à Guillaume pour CHAQUE analyse gratuite. Si 100 analyses/heure → 100 emails.

**Correction** : Supprimer l'email de notification pour les analyses gratuites, ou le remplacer par un log Redis agrégé.

**Effort** : 30 min

### I4 — Rate limiting fail-open

**Description** : `lib/rateLimit.js` retourne `true` (autorise) si Redis est indisponible. C'est un choix conscient (ne pas bloquer les clients si Redis plante), mais ça désactive le rate limiting en cas de panne.

**Impact** : Risque de DDoS sur les routes publiques si Redis tombe.

**Correction** : Acceptable pour l'instant. Documenter comme risque accepté.

**Effort** : 0 (risque accepté)

---

## 4. OPTIMISATIONS

### O1 — Cache pré-check trop court (5 min)

Le même visiteur qui retente après 5 min refait tout le check (3 fetches réseau). 15 min serait plus raisonnable.

### O2 — Stats counter initialisé à 500

`stats.js` initialise le compteur à 500 si absent de Redis. Ce chiffre est arbitraire. Si Redis est flushed, le compteur repart à 500 — pas catastrophique mais pas transparent.

### O3 — Analytics TTL à 10 ans

`track.js` stocke les events analytics avec un TTL de 10 ans. C'est probablement trop long — 1 an suffirait.

### O4 — PDFShift timeout proche du maxDuration

`report-pdf.js` a un timeout PDFShift de 240s pour un maxDuration de 300s. Si PDFShift met 240s, il reste 60s pour le reste du traitement (Redis read, headers). C'est serré mais fonctionnel.

---

## 5. AUDIT PAR DIMENSION

### Dimension 1 — Intégrité flow Stripe ⚠️

- Checkout : OK, signature vérifiée, plans validés
- Webhook : signature vérifiée ✅, mais pas idempotent ❌
- Coupons 100% : gérés (`amount === 0` + `plan === 'pro'` fonctionne)
- Test vs Live : détecté via préfixe `STRIPE_SECRET_KEY` (`sk_test_` vs `sk_live_`)
- Fallback price_data : fonctionne si price_ids manquent ✅
- Montant : validation trop permissive (≥9€) ❌

### Dimension 2 — Chaîne webhook → livraison ⚠️

- 29€ : webhook → finalize-report → email. Flow linéaire, fiable.
- 99€ : webhook → pro-enqueue → 20×workers (QStash) → consolidation → finalize. Flow complexe, chaque étape a des try/catch.
- Remboursement auto : câblé dans finalize et pro-finalize ✅
- Idempotence : absente pour le Pro ❌
- Blocage "en cours" : possible si le counter Redis se désynchronise (rare)
- Alertes : Guillaume est alerté si <5 pages trouvées ✅

### Dimension 3 — QStash ✅

- Signatures vérifiées ✅
- Retries : 3 par message ✅
- Messages staggerés : 20s entre chaque worker ✅
- Lock atomique : SET NX pour éviter double consolidation ✅
- Dead letter : pas de DLQ configurée ⚠️
- Rate limiting : géré via stagger (50 RPM)

### Dimension 4 — Redis ✅

- TTL cohérents : rapports 10 ans, leads 90j, cache analyse 24h, cache Pro 7j, pré-check 5min ✅
- Fallback si down : rate limit fail-open, cache miss gracieux ✅
- Clés standardisées : `detekia:` préfixe partout ✅
- Locale-aware : clé cache inclut la locale (`v21:${url}:${locale}`) ✅
- Compteur audits : `detekia:stats:audit-count`, incrémenté dans finalize ✅
- Données sensibles : emails clients stockés dans les leads (90j TTL) — acceptable si RGPD respecté

### Dimension 5 — Emails Resend ⚠️

- Templates HTML : inline styles, compatibles Gmail/Outlook ✅
- SPF/DKIM/DMARC : dépend de la config DNS de detekia.fr (non vérifiable ici)
- Si Resend plante : try/catch, continue sans bloquer ✅
- Retry : pas de retry automatique ❌ (si Resend échoue, email perdu)
- Email remboursement bilingue : ✅
- Email alerte Guillaume : ✅
- Logs : console.log uniquement, pas de log Redis des emails ⚠️

### Dimension 6 — PDF PDFShift ✅

- maxDuration 300s : suffisant ✅
- Timeout PDFShift 240s : serré mais OK ✅
- Rate limit : 20 req/60s ✅
- Si PDFShift plante : erreur 500 retournée au client ✅
- Accessibilité : non vérifiée (dépend du HTML source)

### Dimension 7 — Variables d'environnement ⚠️

- 18 variables identifiées, toutes lues via `process.env` ✅
- Pas de secrets hardcodés dans le code ✅
- `OPENAI_API_KEY` : nouvelle variable, doit être ajoutée sur Vercel ⚠️
- `LOYALTY_COUPON_ENABLED` : désactivé, peut être retiré à terme
- Rotation : facile pour API keys (changer dans Vercel + redeploy). Plus complexe pour les clés QStash (current/next signing keys — rotation native Upstash).

### Dimension 8 — Rate limiting ✅

- 5 routes protégées avec des seuils adaptés ✅
- Fail-open si Redis down ⚠️ (choix conscient)
- Routes admin non rate-limitées mais protégées par secret ✅
- Webhook Stripe non rate-limité (normal — Stripe gère) ✅
- pre-check.js non rate-limité ⚠️ (pourrait être abusé mais impact limité)

### Dimension 9 — Timeouts ✅

| Route | maxDuration | Timeout externe | Marge |
|---|---|---|---|
| analyze | 120s | Jina 20s + Sonnet 120s | Parallèle → OK |
| pro-consolidate | 300s | 3× Sonnet ~60s chacun | Parallèle → OK |
| report-pdf | 300s | PDFShift 240s | 60s marge |
| pro-finalize | 180s | Sonnet dedup ~30s | Large marge ✅ |
| webhook | non défini ❌ | createSiteAuditJob ~10-30s | Risque si >10s |

### Dimension 10 — Monitoring ❌

- Pas de `/api/health` endpoint
- Pas de Sentry ou équivalent
- Logs : console.log uniquement (accessible via Vercel dashboard mais pas agrégé)
- Alertes : emails à Guillaume (réactif, pas proactif)
- Pas de dashboard de taux d'échec
- Pas de corrélation entre les événements
- Les logs Redis de validation/pré-check sont stockés mais pas exploités (pas d'UI)

---

## 6. CARTOGRAPHIE DES FAILLES POTENTIELLES

| Point de faille | Probabilité | Impact | Détection actuelle | Mitigation |
|---|---|---|---|---|
| Webhook Stripe double | ~2% | Double audit Pro ($4-6 perdu) | Aucune | Ajouter idempotence |
| Stripe webhook timeout | ~1% | Audit non lancé | Aucune | Ajouter maxDuration |
| Anthropic 429 storm (Pro) | ~3% | Rapport dégradé | Console log | Retries + validator |
| OpenAI down | ~1% | Citation test vide | Console log | Fallback gracieux |
| Redis flush | ~0.01% | Tous les rapports perdus | Aucune | Backup Redis (non implémenté) |
| Resend email perdu | ~2% | Client ne reçoit pas le rapport | Console log | Rapport accessible par URL |
| PDFShift timeout | ~1% | PDF non généré | Erreur 500 | Client peut retenter |
| QStash message perdu | ~0.1% | Page non analysée | Counter desync | QStash retries (3) |
| Secret admin compromis | ~0.01% | Suppression rapports possible | Aucune | Audit logs Vercel |

---

## 7. PLAN DE CORRECTION RECOMMANDÉ

### Priorité 1 — Avant cold mailing (1 jour)

| # | Correction | Effort | Fichier |
|---|---|---|---|
| 1 | Idempotence webhook (SET NX session.id) | 30 min | webhook.js |
| 2 | maxDuration: 60 sur webhook.js | 5 min | webhook.js |
| 3 | Validation plan depuis metadata (pas montant) | 30 min | webhook.js |

### Priorité 2 — Cette semaine

| 4 | Secrets admin → header Authorization | 1h | delete-report.js, pro-trigger |
| 5 | Corrélation ID (session.id → job → rapport) | 1h | webhook, pro-enqueue, finalize |
| 6 | Supprimer email notif par analyse gratuite | 30 min | analyze.js |
| 7 | Rate limit sur pre-check.js | 15 min | pre-check.js |

### Priorité 3 — Amélioration continue

| 8 | Endpoint /api/health | 1h | nouveau fichier |
| 9 | Retry Resend email | 30 min | finalize, pro-finalize |
| 10 | Dashboard monitoring Redis | 2-3h | nouveau fichier |

---

## 8. POINTS DE VIGILANCE POUR GUILLAUME

1. **OPENAI_API_KEY** : doit être ajouté sur Vercel avant le cold mailing. Sans cette clé, le test de citation retourne un résultat vide (pas de crash mais section vide dans le rapport).

2. **Webhook idempotence** : c'est la correction la plus urgente. Un double webhook = double audit = double coût API. Ça peut arriver à n'importe quel moment quand Stripe retry.

3. **Emails à Guillaume** : actuellement un email par analyse gratuite. À 100 analyses/jour, ça fait 100 emails. À considérer sérieusement avant le cold mailing.

4. **Pas de backup Redis** : si Upstash flush (extrêmement rare), tous les rapports stockés sont perdus. Les rapports à 10 ans de TTL n'ont aucun backup. Considérer un export périodique.

5. **Rate limit pre-check** : l'endpoint pre-check n'a pas de rate limit. Un bot pourrait scanner des milliers de sites via cet endpoint. Impact : coût réseau + potentiel abus pour de l'intelligence concurrentielle (savoir quels sites ont des sitemaps/anti-bot).
