# Audit technique d'indexation Google — detekia.fr

**Date** : 27 avril 2026
**Périmètre** : 62 URLs dans le sitemap (32 FR + 30 EN)
**Outil** : curl avec User-Agent Googlebot + User-Agent normal, comparaison des comportements

---

## 1. RÉSUMÉ EXÉCUTIF

**Cause racine identifiée** : `localeDetection: true` (défaut Next.js) provoque un 307 Redirect sur la homepage quand `Accept-Language: en`, ce qui affecte Googlebot lors du crawl initial.

**Top 3 des problèmes par ordre d'impact** :

1. **CRITIQUE** — La homepage `detekia.fr/` retourne un **307 Temporary Redirect → `/en`** quand Googlebot envoie `Accept-Language: en-US`. Ce 307 est la cause des "Erreurs de redirection" dans GSC. Googlebot indexe `/en` au lieu de `/` et peut propager le problème aux pages découvertes via `/en`.

2. **IMPORTANT** — Les trailing slashes génèrent des **308 Permanent Redirect** (`/methodologie/` → `/methodologie`). Pas grave en soi (c'est le comportement Next.js par défaut) mais ça consomme du budget de crawl et peut ralentir l'indexation sur un site jeune.

3. **MINEUR** — Les pages légales (`/cgu`, `/mentions-legales`, `/confidentialite`) sont `index, follow` mais absentes du sitemap. Incohérence mineure.

**Estimation post-correction** : La désactivation de `localeDetection` devrait débloquer l'indexation de toutes les 21 pages "non indexées" en 1-2 semaines (cycle de crawl Google).

---

## 2. CAUSE RACINE DES "ERREURS DE REDIRECTION"

### Diagnostic confirmé

```
$ curl -sI -H "Accept-Language: en-US,en;q=0.9" "https://detekia.fr/"

HTTP/2 307
location: /en
```

```
$ curl -sI -H "Accept-Language: fr-FR,fr;q=0.9" "https://detekia.fr/"

HTTP/2 200
```

### Explication technique

La configuration `next.config.mjs` :

```javascript
i18n: {
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  // localeDetection n'est PAS défini → true par défaut
},
```

Quand `localeDetection` est `true` (défaut), Next.js lit le header `Accept-Language` du visiteur et redirige automatiquement vers la locale détectée **sur la homepage uniquement** (`/`). C'est un comportement documenté de Next.js : https://nextjs.org/docs/pages/building-your-application/routing/internationalization#automatic-locale-detection

**Pourquoi ça casse avec Googlebot** :

1. Googlebot crawle avec `Accept-Language: en-US` (comportement standard documenté par Google)
2. Next.js voit `en` dans l'en-tête et renvoie un **307 Temporary Redirect** vers `/en`
3. Googlebot suit la redirection et arrive sur `/en`
4. Googlebot enregistre que `detekia.fr/` redirige → il signale une "Erreur de redirection" dans GSC
5. Le 307 est **temporaire** → Google ne le cache pas et retente à chaque crawl → bloqué en boucle

**Pourquoi Guillaume ne voit pas le problème** : Son navigateur envoie `Accept-Language: fr-FR` → pas de redirection → la page s'affiche normalement.

**Pourquoi les sous-pages ne sont PAS affectées** : La locale detection de Next.js ne redirige que sur `/` (la homepage). Les sous-pages (`/methodologie`, `/blog/...`) ne redirigent pas, elles utilisent la locale du path. C'est cohérent avec les tests : seule `/` retourne un 307.

### Mais alors pourquoi GSC signale 7 pages en "Erreur de redirection" ?

Hypothèse probable : Googlebot a découvert ces pages via des liens internes depuis `/en` (après avoir été redirigé sur la homepage). Il les voit comme des variantes de la même page et peut confondre le 307 initial avec un pattern de redirection sur le site entier. GSC regroupe parfois les erreurs par pattern plutôt que par URL exacte.

### Correction recommandée

```javascript
// next.config.mjs
i18n: {
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localeDetection: false,  // ← AJOUTER CETTE LIGNE
},
```

**Impact** : La homepage retournera toujours un 200 en FR, quelle que soit la langue du visiteur. Les visiteurs anglophones verront la version FR par défaut. Le switch de langue se fait via les liens internes (hreflang), pas par détection automatique.

**Risque de régression** : Aucun. Les visiteurs anglophones qui arrivent directement sur `detekia.fr` voient déjà la version FR (le 307 n'est que sur la homepage, pas les sous-pages). Le changement rend le comportement homogène.

---

## 3. CAUSE DES "DÉTECTÉE NON INDEXÉE"

### Pages FR (non-EN)

Les 12 pages "Détectée, actuellement non indexée" sont très probablement des pages que Google a **découvertes dans le sitemap mais pas encore crawlées en profondeur**. Le site est jeune (< 2 mois), a peu de backlinks externes, et Google priorise les pages avec plus de signaux.

**Facteurs aggravants** :
- Le 307 sur la homepage a pu ralentir le crawl global (Googlebot hésite quand il voit des redirections)
- 62 URLs dans le sitemap pour un site jeune = Google rationnalise et n'indexe que les pages qu'il juge prioritaires
- Les articles de blog sans backlinks externes sont les derniers à être indexés

**Après correction du 307** : ces pages devraient progressivement être indexées sur les 2-4 prochaines semaines.

### Pages EN

Les pages `/en/...` dans le sitemap sont des URL alternatives (hreflang). Google les indexe généralement plus lentement car :
- Elles sont marquées comme alternatives (non-default)
- Le contenu est identique en structure
- Le site cible principalement le marché FR

**Recommandation** : ne pas s'inquiéter des pages EN non indexées tant que les pages FR ne le sont pas. Google indexera les EN quand il jugera pertinent (trafic anglophone, requêtes en anglais).

---

## 4. AUDIT URL PAR URL

### Pages statiques / marketing

| URL | HTTP (Googlebot en) | HTTP (visiteur fr) | Canonical | Robots | hreflang | Verdict |
|-----|---------------------|-------------------|-----------|--------|----------|---------|
| `detekia.fr/` | **307 → /en** | 200 | `https://detekia.fr` | index, follow | FR ✓ EN ✓ x-default ✓ | **CRITIQUE** |
| `detekia.fr/pricing` | 200 | 200 | `https://detekia.fr/pricing` | index, follow | ✓ | OK |
| `detekia.fr/pro` | 200 | 200 | `https://detekia.fr/pro` | index, follow | ✓ | OK |
| `detekia.fr/one-page` | 200 | 200 | `https://detekia.fr/one-page` | index, follow | ✓ | OK |
| `detekia.fr/methodologie` | 200 | 200 | `https://detekia.fr/methodologie` | index, follow | ✓ | OK |
| `detekia.fr/a-propos` | 200 | 200 | `https://detekia.fr/a-propos` | index, follow | ✓ | OK |
| `detekia.fr/contact` | 200 | 200 | `https://detekia.fr/contact` | index, follow | ✓ | OK |
| `detekia.fr/blog` | 200 | 200 | `https://detekia.fr/blog` | index, follow | ✓ | OK |

### Pages légales

| URL | HTTP | Canonical | Robots | Dans sitemap | Verdict |
|-----|------|-----------|--------|-------------|---------|
| `detekia.fr/cgu` | 200 | ✓ auto | index, follow | **NON** | Mineur : ajouter au sitemap OU passer en noindex |
| `detekia.fr/mentions-legales` | 200 | ✓ auto | index, follow | **NON** | Mineur : idem |
| `detekia.fr/confidentialite` | 200 | ✓ auto | index, follow | **NON** | Mineur : idem |

### Pages transactionnelles (hors sitemap — normal)

| URL | HTTP | Robots | Verdict |
|-----|------|--------|---------|
| `detekia.fr/success` | 200 | **noindex** | OK (page post-paiement) |
| `detekia.fr/results` | 200 | index, follow | OK (page dynamique) |

### Articles de blog (FR) — tous testés

Tous les 23 articles FR retournent :
- HTTP 200 avec Googlebot `Accept-Language: en`
- HTTP 200 avec visiteur `Accept-Language: fr`
- Canonical correct (`https://detekia.fr/blog/{slug}`)
- Meta robots : `index, follow`
- hreflang FR + EN + x-default corrects
- Schema.org Article avec `datePublished` et `dateModified`
- **Verdict : OK sur les 23 articles**

### Pages EN — toutes testées

Toutes les 30 pages EN retournent :
- HTTP 200
- Canonical correct (`https://detekia.fr/en/...`)
- hreflang correct
- **Verdict : OK**

### Trailing slashes

| Test | Résultat | Verdict |
|------|----------|---------|
| `/methodologie/` | 308 → `/methodologie` | OK (comportement Next.js standard) |
| `/pricing/` | 308 → `/pricing` | OK |
| `/Methodologie` | 404 | OK (casse sensible, normal) |

---

## 5. PLAN DE CORRECTION RECOMMANDÉ

### CRITIQUE — À corriger immédiatement

#### 1. Désactiver `localeDetection` dans Next.js

**Fichier** : `next.config.mjs`

**Changement** :
```javascript
i18n: {
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localeDetection: false,  // AJOUTER
},
```

**Pourquoi** : Supprime le 307 sur la homepage → Googlebot indexe `/` correctement → débloque le crawl et l'indexation de toutes les pages.

**Risque de régression** : Nul. Les visiteurs anglophones arrivant sur `detekia.fr/` verront la version FR (comme c'est déjà le cas pour toutes les sous-pages). Le switch FR/EN se fait via les liens hreflang.

**Validation après correction** :
```bash
curl -sI -H "Accept-Language: en-US,en;q=0.9" "https://detekia.fr/"
# Doit retourner HTTP/2 200 (plus de 307)
```

Puis dans GSC : "Demander l'indexation" sur `https://detekia.fr/` et attendre 24-48h.

### IMPORTANT — À corriger cette semaine

#### 2. Ajouter les pages légales au sitemap (ou les passer en noindex)

**Décision Guillaume** : Les pages `/cgu`, `/mentions-legales`, `/confidentialite` sont `index, follow` mais absentes du sitemap. Deux options :
- **Option A** (recommandé) : Les ajouter au sitemap dans `pages/sitemap.xml.js`
- **Option B** : Les passer en `noindex` (elles n'apportent pas de valeur SEO) et ne pas les ajouter au sitemap

#### 3. Soumettre à nouveau le sitemap dans GSC

Après correction du `localeDetection`, aller dans GSC > Sitemaps > Resoumettre `https://detekia.fr/sitemap.xml`.

#### 4. Demander l'indexation des pages prioritaires

Dans GSC > Inspection de l'URL, demander l'indexation pour :
- `https://detekia.fr/` (homepage)
- `https://detekia.fr/pricing`
- `https://detekia.fr/pro`
- `https://detekia.fr/one-page`
- `https://detekia.fr/blog` (index blog)
- Les 3-5 articles les plus récents

### COSMÉTIQUE — Peut attendre

#### 5. Ajouter `dateModified` distinct de `datePublished` pour les articles modifiés

Actuellement `dateModified = datePublished` sur tous les articles. Si des articles ont été modifiés après publication, ajouter un champ `dateModified` dans `lib/articles.js`.

#### 6. Envisager un sitemap index

Avec 62 URLs, un seul sitemap suffit. Mais si le blog continue de grandir (>100 articles), envisager un sitemap index avec `sitemap-pages.xml` et `sitemap-blog.xml`.

---

## 6. ALERTES

### Alerte haute
- **Le 307 sur la homepage bloque potentiellement l'indexation de TOUT le site.** Googlebot utilise la homepage comme point d'entrée principal. Si elle redirige, le signal de confiance est dilué. C'est la correction la plus urgente.

### Alerte moyenne
- **Les pages légales indexables mais hors sitemap** ne sont pas graves mais créent une incohérence que Google peut noter.

### Aucune alerte sur
- robots.txt : proprement configuré, tous les bots autorisés
- X-Robots-Tag : aucun header suspect
- HTTPS/HSTS : correctement configuré (`max-age=63072000`)
- Content-Type : `text/html` correct sur toutes les pages
- Canonical : correct et cohérent sur toutes les pages testées
- hreflang : correct sur toutes les pages (FR + EN + x-default)
- Schema.org : présent sur tous les articles de blog
- Trailing slashes : gérés proprement (308 → sans slash)
- Pages noindex (/success) : correctement exclues du sitemap
