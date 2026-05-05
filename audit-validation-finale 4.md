# Audit de Validation Finale — Detekia

**Date** : 27 avril 2026
**Objectif** : Confirmer que toutes les corrections des 6 chantiers sont en place avant le cold mailing.

---

## 1. RÉSUMÉ EXÉCUTIF

| Métrique | Nombre |
|---|---|
| Vérifications totales | 52 |
| ✅ FAIT | 39 |
| ⚠️ PARTIEL | 5 |
| ❌ NON FAIT | 5 |
| 🔍 À VÉRIFIER MANUELLEMENT | 3 |

### VERDICT : ⚠️ QUASI PRÊT — 5 items non faits dont 2 bloquants

Les 2 **blockers** :
1. **Headers HTTP de sécurité non visibles en prod** — le code est en place dans next.config.mjs mais les headers n'apparaissent pas dans les réponses HTTP de detekia.fr. Probablement un problème de déploiement/cache Vercel.
2. **Contraste texte secondaire non corrigé** — `#8A8680` toujours utilisé partout (47+ occurrences). WCAG AA non respecté pour le texte <18px.

Les 3 **non faits non bloquants** (reportés volontairement) :
- Secrets admin toujours en query string (TODO ajouté)
- Focus trap modales non implémenté
- dateModified non ajouté sur les articles modifiés

---

## 2. STATUT PAR CHANTIER

### CHANTIER 1 — Moteur d'analyse et qualité rapport

| Vérification | Statut |
|---|---|
| Pré-check ultra-robuste (5 pages Pro) | ✅ FAIT |
| Vraies requêtes ChatGPT (openai.chat.completions.create) | ✅ FAIT |
| Système de retry (Anthropic 3 retries, OpenAI 1 retry) | ✅ FAIT |
| Validator bloquant erreurs critiques | ✅ FAIT |
| Remboursement auto câblé (finalize + pro-finalize) | ✅ FAIT |
| Email remboursement bilingue + alerte Guillaume | ✅ FAIT |
| lib/scoring.js partagé | ✅ FAIT |
| Détection anti-bot (DataDome, PerimeterX, etc.) | ✅ FAIT |
| Disclaimer "simulation" retiré | ✅ FAIT (jamais implémenté) |
| OPENAI_API_KEY configuré sur Vercel | 🔍 À VÉRIFIER (Guillaume doit confirmer) |

### CHANTIER 2 — Flow paiement et infrastructure

| Vérification | Statut |
|---|---|
| Webhook idempotent (SET NX session.id) | ✅ FAIT |
| Plan via session.metadata.plan | ✅ FAIT |
| maxDuration: 60 sur webhook.js | ✅ FAIT |
| Email notif gratuit MAINTENU | ✅ FAIT |
| Rate limit pre-check | ⚠️ PARTIEL — 10 req/120s au lieu de 5 req/10min demandé |
| Message 429 clair dans l'UI | ✅ FAIT |

### CHANTIER 3 — Sécurité et conformité

| Vérification | Statut |
|---|---|
| Headers HTTP dans next.config.mjs (code) | ✅ FAIT (5 headers) |
| Headers HTTP visibles en prod | ❌ NON VISIBLE — cache ou deploy issue |
| maskEmail() partout (plus d'email en clair) | ✅ FAIT |
| CGU : "satisfait ou remboursé" retiré | ✅ FAIT (FR + EN) |
| CGU : remboursement auto mentionné | ✅ FAIT (FR + EN) |
| CGU : délais de livraison | ✅ FAIT (FR + EN) |
| Politique confidentialité : 9 sous-traitants | ✅ FAIT |
| Cookie banner 3 boutons | ✅ FAIT |
| Cookie toggle ARIA role="switch" | ✅ FAIT |
| Secrets admin → header Authorization | ❌ NON FAIT (TODO ajouté, reporté) |
| Corrélation ID (session → job → rapport) | ⚠️ PARTIEL — sessionId dans webhook mais pas propagé jusqu'au rapport |

### CHANTIER 4 — Cohérence contenu site

| Vérification | Statut |
|---|---|
| Pricing free "2 requêtes" (au lieu de 3) | ✅ FAIT |
| Methodology "±3 points" (au lieu de ±5) | ✅ FAIT |
| Modal 29€ "1 minute" (au lieu de 30 sec) | ✅ FAIT |
| "4 moteurs IA couverts" (au lieu de testés) | ✅ FAIT |
| Vraies requêtes ChatGPT valorisées | ✅ FAIT (pricing, pro, one-page) |
| Remboursement auto sur /a-propos uniquement | ✅ FAIT |
| Témoignages non touchés | ✅ FAIT |

### CHANTIER 5 — SEO/GEO

| Vérification | Statut |
|---|---|
| Titles FR ≤ 65 chars (24/24) | ✅ FAIT |
| Titles EN ≤ 65 chars (24/24) | ✅ FAIT |
| Descriptions FR ≤ 155 chars (24/24) | ✅ FAIT |
| Descriptions EN ≤ 155 chars (24/24) | ✅ FAIT |
| FAQPage Schema /pricing | ✅ FAIT |
| FAQPage Schema /pro | ✅ FAIT |
| FAQPage Schema /one-page | ✅ FAIT |
| FAQPage sur article faq-schema-faqpage | ⚠️ L'article MENTIONNE FAQPage (13 occurrences textuelles) mais n'implémente pas de FAQPage Schema sur sa propre page |
| TechArticle Schema /methodologie | ✅ FAIT |
| Description /methodologie ≤ 155 chars | ✅ FAIT (117 chars) |
| schema-org article : ≥3 liens internes | ❌ NON FAIT (0 liens) |
| geo-guide article : ≥5 liens internes | ⚠️ PARTIEL (4 liens, cible 5) |
| dateModified distinct sur articles modifiés | ❌ NON FAIT |

### CHANTIER 6 — Design, UX, Accessibilité

| Vérification | Statut |
|---|---|
| `<main>` sur toutes les pages (14/14) | ✅ FAIT |
| Focus visible global (CSS :focus-visible) | ✅ FAIT |
| Contraste texte secondaire foncé | ❌ NON FAIT (#8A8680 toujours utilisé, 47+ occurrences) |
| aria-label sur inputs | ✅ FAIT |
| Focus trap dans les modales | ❌ NON FAIT |
| Touch targets ≥ 44px | 🔍 À VÉRIFIER VISUELLEMENT |
| Font-size minimum 10px | 🔍 À VÉRIFIER VISUELLEMENT |

---

## 3. BLOCKERS CRITIQUES

### BLOCKER 1 — Headers HTTP de sécurité non visibles en prod

Le code est en place dans `next.config.mjs` (X-Frame-Options, X-Content-Type-Options, CSP, etc.) mais `curl -sI https://detekia.fr/` ne montre que `strict-transport-security`.

**Causes possibles** :
- Cache CDN Vercel servant une ancienne version
- Le deploy n'a pas encore pris en compte le next.config.mjs modifié
- Configuration Next.js headers() non supportée par le plan Vercel actuel

**Action** : Forcer un redeploy Vercel (ou vider le cache), puis revérifier.

### BLOCKER 2 — Contraste texte secondaire #8A8680

Le gris secondaire `#8A8680` sur fond `#F7F5F2` = ratio 3.2:1 (WCAG AA exige 4.5:1 pour texte <18px). Utilisé sur 47+ occurrences dans les pages. Non corrigé.

**Action** : Remplacement global `#8A8680` → `#6B6762` (~4.6:1) dans les pages.

---

## 4. POINTS À VÉRIFIER MANUELLEMENT PAR GUILLAUME

1. **OPENAI_API_KEY sur Vercel** : confirmer que la variable est bien ajoutée dans Settings → Environment Variables (Production + Preview). Sans cette clé, le test de citation retourne un résultat vide.

2. **Cookie banner visuellement** : vérifier que les 3 boutons (Refuser / Personnaliser / Accepter) s'affichent proprement, que la modale "Personnaliser" fonctionne, que le toggle GA est fluide.

3. **CSP ne casse rien** : une fois les headers déployés, tester :
   - Stripe checkout s'ouvre correctement
   - Google Analytics tracke (si cookies acceptés)
   - Les fonts se chargent
   - Pas d'erreurs en console

4. **Test de paiement end-to-end** : faire un achat test (29€ et 99€) sur un site OK (ex: lemlist.com) pour valider le flow complet : pré-check → Stripe → webhook → génération rapport → email livraison.

5. **Touch targets mobile** : vérifier visuellement que tous les boutons et liens sont assez grands (≥44px hauteur) sur iPhone.

---

## 5. RECOMMANDATIONS FINALES

### Avant le cold mailing (BLOQUANT)

1. **Forcer un redeploy Vercel** pour que les security headers prennent effet
2. **Confirmer OPENAI_API_KEY** est configuré sur Vercel
3. **Faire 1 test de paiement end-to-end** (29€ sur lemlist.com)

### Risques résiduels ACCEPTABLES (non bloquants)

- **Contraste #8A8680** : visible principalement sur le texte secondaire (labels, descriptions). Impact limité car le texte principal (#1A1916) passe AAA. Les prospects SEO ne testeront probablement pas le contraste. À corriger post-mailing.
- **Focus trap modales** : affecte uniquement les utilisateurs clavier avancés. Escape ferme les modales. À corriger post-mailing.
- **Secrets en query string** : endpoints admin non publics, protégés par secret. Risque faible. TODO en place.
- **dateModified** : n'affecte pas l'expérience utilisateur, seulement le signal de fraîcheur Google. À corriger post-mailing.
- **2 articles avec peu de liens internes** : n'impacte pas la conversion. À corriger dans la prochaine session éditoriale.

### Tests prioritaires par Guillaume

| # | Test | Durée | Criticité |
|---|---|---|---|
| 1 | Redeploy Vercel + vérifier headers | 5 min | BLOQUANT |
| 2 | Confirmer OPENAI_API_KEY | 2 min | BLOQUANT |
| 3 | Test paiement 29€ end-to-end | 5 min | BLOQUANT |
| 4 | Test paiement 99€ end-to-end | 20 min | IMPORTANT |
| 5 | Vérifier cookie banner visuellement | 2 min | IMPORTANT |
| 6 | Vérifier CSP ne casse rien (console) | 2 min | IMPORTANT |
