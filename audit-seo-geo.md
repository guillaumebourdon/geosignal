# Audit SEO/GEO Complet — Detekia

**Date** : 27 avril 2026
**Périmètre** : Toutes les pages produit + 24 articles FR/EN + infrastructure SEO

---

## 1. RÉSUMÉ EXÉCUTIF

**Note SEO globale : 7/10**
Infrastructure solide (sitemap, robots.txt, hreflang, canonical, H1 uniques). Faiblesses : 16/24 articles FR ont des titles >70 chars (truncation Bing/Google), 8 descriptions trop longues, FAQ Schema absent sur les pages payantes.

**Note GEO globale : 8/10**
Excellente base : llms.txt complet, robots.txt permissif pour tous les bots IA, contenu structuré (H2/H3, listes, tableaux), FAQPage Schema sur la homepage. Faiblesses : pas de FAQPage Schema sur les pages avec FAQ (/pricing, /pro, /one-page), certains articles manquent de liens internes.

**Top 5 problèmes SEO :**
1. 16/24 articles FR ont des titles >70 caractères → truncation dans les SERP
2. 8/24 articles FR ont des descriptions >160 caractères → truncation
3. FAQPage Schema absent sur /pricing, /pro, /one-page (ont des FAQ mais pas le markup)
4. Pages légales ont des meta descriptions trop courtes (<120 chars)
5. /methodologie n'a pas de Schema.org (devrait avoir WebPage ou Article)

**Top 5 problèmes GEO :**
1. FAQPage Schema uniquement sur la homepage — les articles parlant de FAQ n'ont pas leur propre FAQPage markup
2. 1 article (schema-org-ia-guide-pratique) a 0 liens internes — contradiction pour un article technique
3. Pas de Schema Article sur /methodologie (page référence de la méthodologie)
4. Le contenu des pages produit (/pro, /one-page) est structuré en features mais pas en paragraphes "citables" (peu de définitions directes en début de section)
5. Les articles n'ont pas de dateModified distincte de datePublished (tous identiques dans le code)

---

## 2. AUDIT PAR PAGE PRODUIT

### Homepage (/) — SEO 8/10 — GEO 9/10
- Title : 61 chars ✅ | Description : 154 chars ✅
- Schema : SoftwareApplication + Organization + FAQPage ✅
- H1 unique ✅ | OG image ✅ | hreflang ✅
- FAQPage avec 10 questions ✅
- **Manque** : SearchAction dans WebSite schema

### /pricing — SEO 7/10 — GEO 6/10
- Title : 67 chars ✅ | Description : 159 chars ✅
- Schema : Product + Offers ✅
- **Problème GEO** : FAQ accordion en <details> SANS FAQPage Schema → les IA ne voient pas les réponses structurées
- **Action** : Ajouter FAQPage Schema

### /pro — SEO 8/10 — GEO 7/10
- Title : 43 chars ✅ | Description : 157 chars ✅
- Schema : Product ✅
- **Problème GEO** : FAQ sans FAQPage Schema, features en cards pas en paragraphes citables
- **Action** : Ajouter FAQPage Schema

### /one-page — SEO 8/10 — GEO 7/10
- Mêmes constats que /pro

### /methodologie — SEO 6/10 — GEO 7/10
- Title : 67 chars ✅ | Description : 171 chars ❌ (>160)
- **Pas de Schema.org** ❌ (devrait avoir WebPage ou Article)
- Contenu très structuré (8 critères, tableau comparatif) → bon pour le GEO
- **Actions** : Tronquer description, ajouter Schema WebPage

### /a-propos — SEO 7/10 — GEO 6/10
- Title : 26 chars (court mais OK) | Description : 134 chars ✅
- Schema : AboutPage + Organization + Person ✅
- Contenu court, peu de données structurées pour la citabilité IA

### /contact — SEO 6/10 — GEO 5/10
- Title : 20 chars (très court) | Description : 131 chars ✅
- Schema : ContactPoint ✅
- Page utile mais peu de valeur SEO/GEO

---

## 3. AUDIT DES ARTICLES DE BLOG (24 FR + 24 EN)

### Articles avec title FR >70 chars (16/24) :

| # | Slug | Title FR (chars) | Description FR (chars) | Problèmes |
|---|---|---|---|---|
| 1 | geo-guide-complet-2026 | 79 | 208 ❌ | Title + desc trop longs |
| 3 | seo-vs-geo-differences-2026 | 83 | 195 ❌ | Title + desc trop longs |
| 5 | schema-org-ia-guide-pratique | 80 | 149 ✅ | Title trop long |
| 6 | ecommerce-recommandations-ia | 87 | 197 ❌ | Title + desc trop longs |
| 7 | 8-criteres-geo-methodologie | 78 | 163 ❌ | Title trop long, desc limite |
| 8 | llms-txt-robots-crawlabilite | 78 | 142 ✅ | Title trop long |
| 9 | geo-agences-seo-audit-ia | 85 | 162 ❌ | Title + desc trop longs |
| 10 | ai-overviews-google-2026 | 80 | 165 ❌ | Title + desc trop longs |
| 11 | audit-geo-visibilite-ia | **103** | 145 ✅ | Title TRÈS trop long |
| 12 | reddit-geo-source-ia | 85 | 156 ✅ | Title trop long |
| 13 | concurrents-chatgpt-visibilite | 80 | 143 ✅ | Title trop long |
| 14 | pourquoi-trafic-google-baisse | **94** | 180 ❌ | Title + desc trop longs |
| 15 | sites-bloquent-bots-ia | 87 | 198 ❌ | Title + desc trop longs |
| 17 | comment-chatgpt-choisit | 72 | 188 ❌ | Title limite, desc trop longue |
| 18 | perplexity-comment-apparaitre | 82 | 151 ✅ | Title trop long |
| 22 | contenu-long-vs-court-ia | **98** | 213 ❌ | Title + desc TRÈS trop longs |

### Articles EN : 2 titles >70 chars
- audit-geo-visibilite-ia EN : 72 chars (limite)
- pourquoi-trafic-google-baisse EN : 80 chars ❌
- contenu-long-vs-court-ia EN : 72 chars (limite)

### Schema.org sur les articles : ✅
- Tous les articles ont : Article schema, datePublished, dateModified, author, publisher
- `<time datetime>` ajouté récemment ✅
- OG article:published_time et article:modified_time ✅

### Liens internes (échantillon 5 articles) :
- backlinks-geo : 5 liens ✅
- sitemap-robots : 4 liens ✅
- contenu-long-vs-court : 4 liens ✅
- geo-guide-complet : 2 liens (peu pour un guide pilier)
- schema-org-ia : **0 liens** ❌

---

## 4. PROBLÈMES TRANSVERSES

### P1 — Titles FR trop longs (systémique)
16/24 articles dépassent 70 chars en FR. Cause : les titres FR sont naturellement plus longs que les EN. Google tronque à ~60 chars dans les SERP (selon la largeur en pixels), Bing à ~70.

**Impact** : truncation des titles dans les résultats de recherche → CTR réduit.
**Correction** : raccourcir les 16 titles FR sous 65 chars.

### P2 — Descriptions FR trop longues (systémique)
8/24 articles dépassent 160 chars. Google tronque à ~155-160 chars.

**Impact** : descriptions tronquées → message incomplet.
**Correction** : raccourcir sous 155 chars.

### P3 — dateModified = datePublished sur tous les articles
Le code utilise `article.date` pour les deux. Les articles modifiés n'ont pas de dateModified distincte.

**Impact** : Google ne sait pas quels articles ont été mis à jour. Signal de fraîcheur perdu.

### P4 — FAQPage Schema absent sur 12+ pages avec du contenu FAQ
Seule la homepage a le FAQPage Schema. /pricing, /pro, /one-page ont des FAQ en <details> mais sans markup.

---

## 5. PERFORMANCE (TTFB)

| Page | TTFB | Verdict |
|---|---|---|
| Homepage | 0.47s | ✅ Bon |
| /pricing | 0.31s | ✅ Excellent |
| /pro | 0.50s | ✅ Bon |
| Article blog | 0.80s | ⚠️ Acceptable (SSG mais cold start) |
| OG Image API | 200 OK, 41KB | ✅ |

---

## 6. CONFORMITÉ DETEKIA À SA PROPRE MÉTHODOLOGIE

Si on auditait detekia.fr avec Detekia, estimation du score GEO :

| Critère | Score estimé | Max | % | Notes |
|---|---|---|---|---|
| Extractibilité | 20 | 25 | 80% | Contenu structuré (H2/H3, listes, tableaux) ✅ Intro pas toujours "answer-first" |
| Vérifiabilité | 16 | 20 | 80% | Stats sourcées, dates présentes, liens externes dans les articles ✅ |
| Autorité E-E-A-T | 13 | 15 | 87% | Auteur identifié, /a-propos, Schema Organization+Person ✅ |
| Crawlabilité IA | 14 | 15 | 93% | robots.txt permissif, llms.txt, lang, canonical, sitemap ✅ |
| Données structurées | 7 | 10 | 70% | FAQPage homepage ✅ mais absent sur /pricing, /pro ❌ |
| Neutralité éditoriale | 8 | 10 | 80% | Ton factuel, pas trop promotionnel ✅ |
| Présence externe | 3 | 5 | 60% | LinkedIn présent, pas de mentions presse, peu de citations tierces |
| Fraîcheur | 4 | 5 | 80% | Articles récents (mars-avril 2026), copyright 2026 ✅ |

**Score GEO estimé : 85/100** — Bon, mais perfectible sur les données structurées et la présence externe.

---

## 7. PLAN DE CORRECTION RECOMMANDÉ

### CRITIQUE (avant cold mailing)

| # | Correction | Effort | Impact |
|---|---|---|---|
| 1 | Raccourcir les 16 titles FR >70 chars | 1h | SEO SERP |
| 2 | Raccourcir les 8 descriptions FR >160 chars | 30 min | SEO SERP |
| 3 | Ajouter FAQPage Schema sur /pricing, /pro, /one-page | 1h | GEO + Rich Snippets |

### IMPORTANT (cette semaine)

| 4 | Tronquer description /methodologie (171→155 chars) | 5 min | SEO |
| 5 | Ajouter Schema WebPage sur /methodologie | 15 min | GEO |
| 6 | Ajouter liens internes dans schema-org-ia-guide-pratique | 15 min | GEO maillage |
| 7 | Ajouter 2-3 liens internes dans geo-guide-complet | 10 min | GEO maillage (article pilier) |

### OPTIMISATION (backlog)

| 8 | Ajouter dateModified distincte sur les articles modifiés | 30 min | Fraîcheur |
| 9 | SearchAction dans WebSite Schema homepage | 15 min | Rich Snippets |
| 10 | Enrichir descriptions légales (mentions, CGU, confidentialité) | 15 min | SEO |

---

## 8. ALERTES

- **Bing a déjà signalé des titles trop longs** — confirme le problème systémique des 16 articles FR
- **L'article "faq-schema-faqpage-combo-ia"** parle de FAQPage Schema mais n'implémente PAS de FAQPage Schema sur sa propre page — contradiction embarrassante pour un site qui vend du GEO
- **Score GEO Detekia auto-audité : 85/100** — c'est bon mais un prospect qui teste detekia.fr avec Detekia devrait voir un score >85. Les données structurées (70%) sont le point faible principal.
