# Audit Sécurité & Conformité — Detekia

**Date** : 27 avril 2026
**Périmètre** : Code complet, infrastructure, documents légaux, headers HTTP

---

## 1. RÉSUMÉ EXÉCUTIF

**Note de sécurité globale : 8/10**
Le code est globalement sain : pas de secrets hardcodés, UUIDs cryptographiques, inputs validés, pas de XSS. Les faiblesses sont dans les headers HTTP de sécurité (absents) et la gestion des secrets admin (query string).

**Note de conformité RGPD/CGU : 7/10**
La politique de confidentialité est complète et mentionne la majorité des sous-traitants. Les CGU mentionnent le "satisfait ou remboursé" mais pas le nouveau système de remboursement automatique. Le cookie banner n'a pas de bouton "Personnaliser" (CNIL exigence).

**Top 5 risques critiques :**

1. **CRITIQUE (sécurité)** — Aucun header de sécurité HTTP configuré (pas de CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy). N'importe qui peut iframe le site.
2. **CRITIQUE (conformité)** — Cookie banner avec seulement 2 boutons (Accepter/Refuser). La CNIL exige un bouton "Personnaliser" ou équivalent pour le consentement granulaire.
3. **IMPORTANT (conformité)** — CGU : "Satisfait ou remboursé 7 jours" coexiste avec le nouveau remboursement automatique instantané. Incohérence contractuelle à clarifier.
4. **IMPORTANT (conformité)** — Sous-traitants manquants dans la politique de confidentialité : Jina AI, PDFShift, Upstash (nommé génériquement), QStash.
5. **IMPORTANT (sécurité)** — 1 console.log qui leak un email en clair (pro-trigger-consolidation.js:252).

**Risques juridiques majeurs :**
- CNIL : risque de mise en demeure pour cookie banner non conforme (pas de "Personnaliser")
- DGCCRF : risque si un client invoque les CGU "Satisfait ou remboursé" et qu'on refuse

---

## 2. PROBLÈMES CRITIQUES (à corriger avant cold mailing)

### C1 — Headers HTTP de sécurité absents

**Description** : Aucun header de sécurité n'est configuré sur les réponses HTTP de detekia.fr.

**Vérification** :
```
curl -sI https://detekia.fr/
→ strict-transport-security: max-age=63072000 (OK — Vercel par défaut)
→ Pas de X-Frame-Options
→ Pas de X-Content-Type-Options
→ Pas de Content-Security-Policy
→ Pas de Referrer-Policy
→ Pas de Permissions-Policy
```

**Risques** :
- Clickjacking (iframe du site sur un site malveillant)
- MIME type sniffing
- Fuite de referrer vers les sites tiers

**Correction** : Ajouter les headers dans `next.config.mjs` via la propriété `headers()`.

```javascript
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ],
  }];
}
```

**Effort** : 30 min

### C2 — Cookie banner sans bouton "Personnaliser"

**Description** : `components/CookieBanner.js` a 2 boutons (Accepter / Refuser). La CNIL recommande un bouton supplémentaire permettant un consentement granulaire.

**Impact** : Risque de mise en demeure CNIL en cas de contrôle. Les recommandations CNIL (janvier 2022) exigent que le refus soit aussi simple que l'acceptation ET qu'une option de paramétrage soit disponible.

**Correction** : Ajouter un troisième bouton "Personnaliser" qui ouvre une modale avec les catégories de cookies (analytics uniquement dans le cas de Detekia). En pratique, puisque Detekia n'a que Google Analytics comme cookie tiers, le bouton "Personnaliser" montrerait juste GA activable/désactivable.

**Alternative** : Comme Detekia n'a qu'un seul cookie tiers (GA), le banner actuel (Accepter/Refuser) peut être considéré comme suffisant car il n'y a qu'une seule catégorie. Mais c'est un risque assumé.

**Effort** : 2h

### C3 — CGU : incohérence remboursement

**Description** : Les CGU (locales/fr.json lignes 1096-1107) mentionnent :
- "Satisfait ou remboursé" dans les 7 jours (demande manuelle par email)
- Pas de mention du remboursement automatique instantané (système ajouté récemment)

**Risques** :
- Un client qui reçoit un remboursement auto peut être confus (pas dans les CGU)
- Un client qui ne reçoit PAS de remboursement auto (cas non couvert) peut invoquer les 7 jours

**Correction** : Mettre à jour les CGU pour mentionner les 2 mécanismes :
1. Remboursement automatique si le rapport ne peut pas être généré (instantané)
2. Garantie "Satisfait ou remboursé" 7 jours pour tout autre cas

**Effort** : 30 min (wording à valider par Guillaume)

---

## 3. PROBLÈMES IMPORTANTS

### I1 — Console.log leak email

**Fichier** : `pages/api/pro-trigger-consolidation.js:252`
```javascript
console.log(`[pro-trigger] Email sent to ${customerEmail}:`, emailResult);
```
**Correction** : Remplacer par `maskEmail(customerEmail)`.
**Effort** : 5 min

### I2 — Sous-traitants manquants dans la politique de confidentialité

Non mentionnés explicitement :
- **Jina AI** (scraping de contenu — transfert de l'URL du client)
- **PDFShift** (génération PDF — transfert du HTML du rapport)
- **Upstash/QStash** (mentionné comme "Service de base de données hébergé en UE" mais pas nommé)
- **OpenAI** (ajouté récemment pour les vraies requêtes ChatGPT)

**Correction** : Ajouter ces sous-traitants dans la section correspondante de la politique.
**Effort** : 30 min

### I3 — Pas de délai de livraison dans les CGU

Les CGU ne mentionnent pas les délais de livraison (1 minute pour le 29€, 15-20 min pour le 99€). Si un rapport met plus longtemps, le client n'a pas de référence contractuelle.

**Correction** : Ajouter une section "Délais de livraison" dans les CGU.
**Effort** : 15 min

### I4 — Secrets admin en query string (déjà identifié chantier 2)

`DELETE_REPORT_SECRET` et `PRO_ADMIN_SECRET` passés via `?secret=...`. TODO déjà ajouté.

---

## 4. OPTIMISATIONS

### O1 — npm audit : 3 vulnérabilités modérées

PostCSS XSS via Next.js → pas exploitable en pratique (le CSS n'est pas généré depuis des inputs utilisateurs). Fix nécessite un upgrade majeur de Next.js.

### O2 — Pas de CSP (Content Security Policy)

Une CSP stricte empêcherait le chargement de scripts tiers non autorisés. À implémenter avec soin pour ne pas casser Stripe, Google Analytics, etc.

### O3 — Pas de Sentry/error tracking

Les erreurs sont logguées dans la console Vercel uniquement. Un outil comme Sentry permettrait de les agréger et d'alerter.

---

## 5. AUDIT PAR DIMENSION

### Dimension 1 — Secrets et credentials ✅
- Aucun secret hardcodé dans le code source ✅
- `.env` dans `.gitignore` ✅
- Tous les secrets via `process.env` ✅
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` seul exposé côté client (normal) ✅
- `maskEmail()` utilisé dans 4/5 fichiers ✅ (1 manquant → I1)
- Pas de secrets dans l'historique Git ✅

### Dimension 2 — Validation des inputs ✅
- URLs : validées via `new URL()` natif ✅
- Emails : regex + max 254 chars ✅
- Pas d'injection SQL possible (Redis = NoSQL clé-valeur) ✅
- Pas de XSS : `dangerouslySetInnerHTML` uniquement sur contenu hardcodé ✅
- Taille des inputs limitée (email 254 chars, URL via `new URL()`) ✅

### Dimension 3 — Accès non autorisés ✅
- UUIDs générés via `crypto.randomUUID()` (imprévisibles) ✅
- Routes admin protégées par secret ✅ (mais en query string ⚠️)
- Webhook Stripe : signature vérifiée ✅
- `/api/stats` : public, retourne juste un compteur ✅ (pas sensible)
- Rapports : accès par UUID uniquement, pas d'énumération possible ✅

### Dimension 4 — RGPD ⚠️
- Données stockées : emails (leads 90j, rapports 10 ans), URLs, scores ✅
- Durées de conservation documentées dans la politique ✅
- Droit à l'effacement : endpoint `/api/delete-report` existe ✅
- Droit d'accès : via l'URL du rapport (accessible indéfiniment) ✅
- Consentement cookies : obtenu avant tracking ✅
- Cookie banner : 2 boutons au lieu de 3 ❌
- Sous-traitants : partiellement listés ⚠️
- Contact CNIL mentionné ✅
- DPO : non mentionné (non obligatoire pour une petite structure)

### Dimension 5 — CGU et mentions légales ⚠️
- CGU présentes et détaillées ✅
- "Satisfait ou remboursé" 7 jours ✅
- Remboursement automatique non mentionné ❌
- Délais de livraison non mentionnés ❌
- Propriété intellectuelle des rapports ✅
- Limitation de responsabilité ✅
- Mentions légales : raison sociale, RCS, hébergeur ✅

### Dimension 6 — Headers HTTP ❌
- HSTS : ✅ (Vercel par défaut, max-age=63072000)
- X-Content-Type-Options : ❌ absent
- X-Frame-Options : ❌ absent
- CSP : ❌ absent
- Referrer-Policy : ❌ absent
- Permissions-Policy : ❌ absent

### Dimension 7 — Vulnérabilités dépendances ✅
- 3 vulnérabilités modérées (PostCSS via Next.js)
- Non exploitables en pratique
- Fix nécessite upgrade majeur de Next.js

### Dimension 8 — Protection attaques ✅
- CSRF : Next.js API routes sont SameSite par défaut ✅
- DDoS : rate limiting Upstash sur les routes critiques ✅
- Replay : webhook Stripe vérifie signature (inclut timestamp) ✅
- Enumeration UUID : impossible (crypto.randomUUID) ✅
- Pre-check : rate limité (10/120s) ✅

### Dimension 9 — Logging ⚠️
- Actions sensibles logguées (paiements, erreurs) ✅
- maskEmail utilisé presque partout ✅ (1 exception)
- Pas d'audit trail consultable (logs Vercel uniquement)
- Pas d'agrégation d'erreurs (pas de Sentry)

### Dimension 10 — Intégrations tierces ✅
- Stripe : signature webhook vérifiée ✅
- Anthropic/OpenAI : clés côté serveur uniquement ✅
- QStash : signatures vérifiées ✅
- Resend : SPF/DKIM dépend de la config DNS (non vérifiable ici)
- PDFShift : clé côté serveur ✅

---

## 6. CARTOGRAPHIE DES RISQUES JURIDIQUES

| Risque | Source | Probabilité | Impact | Mitigation |
|---|---|---|---|---|
| Mise en demeure CNIL (cookies) | Banner sans "Personnaliser" | Faible | Moyen | Ajouter bouton |
| Litige remboursement | CGU vs remboursement auto | Faible | Faible | Clarifier CGU |
| Fuite données personnelles | Email en clair dans logs | Faible | Moyen | maskEmail() |
| Clickjacking | Pas de X-Frame-Options | Très faible | Faible | Headers |
| Non-conformité sous-traitants | Jina/PDFShift non mentionnés | Faible | Faible | Ajouter |

---

## 7. PLAN DE CORRECTION RECOMMANDÉ

### Avant cold mailing (2-3h)

| # | Correction | Effort | Type |
|---|---|---|---|
| 1 | Headers sécurité dans next.config.mjs | 30 min | Sécurité |
| 2 | maskEmail dans pro-trigger-consolidation.js | 5 min | Sécurité |
| 3 | CGU : ajouter remboursement auto + délais livraison | 30 min | Conformité |
| 4 | Politique confidentialité : ajouter Jina, PDFShift, OpenAI | 30 min | RGPD |

### Cette semaine

| 5 | Cookie banner : bouton "Personnaliser" | 2h | RGPD |
| 6 | Secrets admin → header Authorization | 1h | Sécurité |

### Amélioration continue

| 7 | CSP strict | 2h | Sécurité |
| 8 | Sentry error tracking | 1h | Monitoring |

---

## 8. POINTS DE VIGILANCE POUR GUILLAUME

1. **Cookie banner** : juridiquement, le banner actuel (Accepter/Refuser) est défendable si Detekia n'utilise qu'un seul cookie tiers (GA). Mais la CNIL recommande explicitement un troisième bouton. Décision Guillaume : ajouter "Personnaliser" (2h de travail) ou assumer le risque ?

2. **"Satisfait ou remboursé"** : cette garantie est géniale commercialement mais crée une obligation contractuelle. Avec le nouveau remboursement auto, il faut clarifier dans les CGU : (a) remboursement auto si le rapport ne peut pas être généré, (b) garantie satisfaction 7 jours pour tout autre cas. Les 2 mécanismes coexistent.

3. **Sous-traitants RGPD** : OpenAI est maintenant utilisé pour les vraies requêtes ChatGPT. Il DOIT être mentionné dans la politique de confidentialité avec la mention que les données (URL + contenu de la page) transitent par leurs serveurs US.

4. **Headers de sécurité** : l'absence de X-Frame-Options signifie que n'importe qui peut mettre detekia.fr dans une iframe. Peu exploitable en pratique mais un auditeur technique le remarquerait immédiatement.

5. **npm audit** : les 3 vulnérabilités modérées sont dans PostCSS via Next.js. Elles ne sont PAS exploitables dans le contexte de Detekia (pas de CSS généré depuis des inputs utilisateurs). Pas d'action requise.
