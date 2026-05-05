# Rapport de Validation Produit — Detekia (Vague 2)

Date : 2026-04-28
10 sites testes en one-page FR, chaque rapport verifie manuellement.

---

## TABLEAU RECAPITULATIF

| # | Site | Type | Score | Schemas | Meta desc | Social | Images | Problemes |
|---|------|------|-------|---------|-----------|--------|--------|-----------|
| 1 | crisp.chat | SaaS chat | 69 | ✅ 3/3 match | ✅ | ✅ 5/5 | ✅ 117 | AUCUN |
| 2 | alan.com | Assurance sante | 55 | ✅ match | ✅ | ✅ 3/3 | ✅ 21 | ⚠️ Score Donnees Structurees |
| 3 | backmarket.fr | E-commerce | 77 | ✅ 3/3 match | ✅ | ✅ 4/4 | ✅ 214 | AUCUN |
| 4 | malt.fr | Marketplace | 54 | N/A (403) | N/A | N/A | ✅ 49 | ⚠️ Verification impossible |
| 5 | doctolib.fr | HealthTech | BLOQUE | — | — | — | — | ✅ Correctement bloque |
| 6 | wttj.com | JobBoard | 41 | ✅ 0/0 match | ✅ | ✅ 4/4 | ✅ 19 | ⚠️ Contenu faible |
| 7 | plausible.io | SaaS analytics | 69 | ✅ 1/1 match | ✅ | ✅ 9/9 | ✅ 10 | AUCUN |
| 8 | cal.com | SaaS scheduling | 64 | ✅ 0/0 match | ✅ | ⚠️ Faux positif | ✅ 74 | ⚠️ Lien social parasite |
| 9 | shine.fr | Neobanque | 67 | ✅ 5/5 match | ✅ | ✅ 4/4 | ✅ 16 | AUCUN |
| 10 | pitch.com | SaaS presentations | 64 | ✅ 1/1 match | ✅ | ✅ 5/5 | ✅ 18 | AUCUN |

**Taux de reussite global : 9/10 generes, 0 probleme critique, 3 problemes mineurs**

---

## ANALYSE DETAILLEE PAR RAPPORT

### 1. CRISP.CHAT — 69/100 ✅ Rapport impeccable

**Veracite des scores :** Tous les criteres sont factuellement justes. Les schemas (WebApplication, Organization, WebSite) sont detectes et matchent a 100% avec la realite. Meta description, liens sociaux (5), images (117) tous corrects.

**Recommandations :** 8 recos, toutes sur les 8 criteres standards. La top priorite (SoftwareApplication) est pertinente — Crisp a un WebApplication mais pas de SoftwareApplication. Les recos sont specifiques au produit ("solution de support client", "engagement multicanal"). Code JSON-LD fourni valide.

**Verdict :** Equilibre et factuel. Pas d'alarmisme.

**Problemes :** AUCUN.

---

### 2. ALAN.COM — 55/100 ⚠️ Probleme mineur de scoring

**Veracite des scores :** Globalement correct. Alan a un schema Corporation + 67 ImageObject. Le scoring donne 1/10 pour "Schema: Corporation". Le probleme : Corporation n'est pas dans la liste "medValueTypes" du code (Organization, Person, Product, Service, WebSite). Corporation est un sous-type d'Organization et devrait compter comme tel.

**Score Donnees structurees :** 1/10 au lieu de 3/10. Impact : -2 points sur le score global.

**Detection excellente :** Meta desc detectee, 3 liens sociaux (Twitter, Facebook, LinkedIn) matchent a 100%. 21 images detectees. llms.txt detecte comme present.

**Recommandations :** Pertinentes. "Ajouter schemas Service et FAQ" est correct — Alan n'a ni Service ni FAQPage. "Renforcer signaux d'expertise sante" est adapte au secteur.

**Probleme identifie :** Corporation non reconnue comme medium-value schema. Bug dans le scoring.

---

### 3. BACKMARKET.FR — 77/100 ✅ Meilleur rapport de la serie

**Veracite des scores :** Excellent. Plus haut score de la serie, justifie par : FAQPage detecte (+5), Organization+WebSite (+3), 179 listes, 483 donnees chiffrees, 26 liens externes. Tout matche avec la realite.

**Recommandations :** Tres specifiques au e-commerce : "Ajouter schemas produits e-commerce" (Product, AggregateRating), "Renforcer preuves et temoignages". 7 recos sur 8 ont du code JSON-LD fourni — c'est le rapport avec le plus de code.

**Ce qui est bien :** Le rapport reconnait les forces (FAQPage existant, contenu riche) et cible les manques reels (pas de schema Product sur la homepage, pas de dateModified).

**Problemes :** AUCUN.

---

### 4. MALT.FR — 54/100 ⚠️ Verification partielle

**Contexte :** malt.fr retourne 403 au fetch direct (anti-bot), donc la verification croisee schemas/meta/social est impossible. Mais Jina a reussi a scraper le contenu (2967 mots, 34 headings, 52 liens externes) donc le rapport est base sur du vrai contenu.

**Veracite des scores :** Le scoring semble coherent avec le contenu scrape. 0/10 donnees structurees = non verifiable (fetch direct bloque). 52 liens externes et 26 donnees chiffrees sont plausibles pour une marketplace.

**Recommandations :** Pertinentes pour une marketplace freelance. "Schemas JSON-LD plateforme" est correct. "Optimiser reponses FAQ" est pertinent.

**Probleme :** La meta description n'est pas detectee (Jina ne la renvoie pas, fetch direct bloque). Cela ne change pas le score mais l'evidence est incomplete.

---

### 5. DOCTOLIB.FR — BLOQUE ✅ Correctement refuse

Doctolib retourne une page avec tres peu de contenu (protection anti-bot heavy). Le nouveau seuil (500 chars + 100 mots) bloque correctement la generation. C'est le comportement attendu — aucun rapport bidon n'est genere. Le message d'erreur est clair.

---

### 6. WELCOMETOTHEJUNGLE.COM — 41/100 ⚠️ Contenu faible mais rapport correct

**Contexte :** WTTJ est un site tres JS-heavy. Jina a scrape seulement 296 mots et 1 heading. C'est peu mais au-dessus du seuil de 100 mots.

**Veracite :** Le score 41/100 reflete correctement le peu de contenu accessible. 0/10 schemas (confirme : aucun JSON-LD). 0/5 fraicheur (aucune date). La meta description et les liens sociaux (4) sont bien detectes.

**Question :** Faut-il generer un rapport quand on n'a que 296 mots ? C'est mieux que rien (le rapport est honnete sur les limites), mais le client pourrait etre decu par le peu de specificite. Le verdict mentionne correctement "41/100".

**Recommandations :** Generiques mais correctes pour un site avec peu de contenu accessible. Moins specifiques que les autres rapports.

---

### 7. PLAUSIBLE.IO — 69/100 ✅ Rapport impeccable

**Veracite :** Tout matche. WebSite detecte (pas de SoftwareApplication). Meta desc detectee. 9 liens sociaux (!) dont Twitter, LinkedIn, GitHub, Mastodon — tous confirmes. 10 images.

**Recommandations :** Excellentes. "SoftwareApplication complet" est la top priorite — correct pour un SaaS analytics. "Alternative privacy-friendly a Google Analytics" est correctement identifie dans le verdict. Code JSON-LD fourni avec applicationCategory "WebApplication", offers, et operatingSystem.

**Problemes :** AUCUN.

---

### 8. CAL.COM — 64/100 ⚠️ Faux positif liens sociaux

**Veracite :** Scores corrects. 0 schemas JSON-LD (confirme). Meta desc detectee. 74 images. llms.txt present.

**Probleme identifie :** Detekia detecte 1 lien social, mais c'est un pixel Twitter Analytics (URL de tracking ads, pas un lien social). La verification directe confirme 0 vrai lien social dans le HTML. Score presence externe 4/5 avec "Reseaux sociaux ✓" basé sur ce faux positif.

**Impact :** Le score presence externe est gonfle de +2 points (4/5 au lieu de 2/5). Score global potentiellement 62 au lieu de 64.

**Cause :** Le regex de detection de liens sociaux matche `twitter.com` dans n'importe quel contexte, y compris les URLs de tracking comme `analytics.twitter.com/...`.

**Recommandations :** Pertinentes. "SoftwareApplication JSON-LD" est correct. "Structurer reponses FAQ" avec code fourni est actionnable.

---

### 9. SHINE.FR — 67/100 ✅ Rapport impeccable

**Veracite :** Excellent. 5 schemas detectes (WebSite, Organization, ImageObject, SoftwareApplication, WebPage) — tous confirmes. Shine est un des rares sites de la serie avec un SoftwareApplication ! Meta desc, 4 liens sociaux, 16 images — tout correct.

**Recommandations :** Tres adaptees au secteur fintech. "Enrichir schemas metier" (FinancialProduct, Service) est pertinent — Shine a SoftwareApplication mais pas de schema specifique banque. Le rapport reconnait les schemas existants (score 3/10, pas 0).

**Point positif :** Le rapport detecte que Shine a deja des schemas et recommande d'aller plus loin (FinancialProduct), au lieu de recommander d'ajouter ce qui existe deja. Bonne calibration.

**Problemes :** AUCUN.

---

### 10. PITCH.COM — 64/100 ✅ Rapport correct

**Veracite :** WebPage detecte (confirme). Meta desc, 5 liens sociaux, 18 images — tout correct. Score 1/10 donnees structurees (WebPage = type non classifie high/med, donc +1 point).

**Recommandations :** Standard mais correctes pour un SaaS presentations. "SoftwareApplication complet" est la top priorite. Code JSON-LD fourni valide.

**Problemes :** AUCUN.

---

## ANALYSE COMPARATIVE — LES RAPPORTS SE RESSEMBLENT-ILS TROP ?

### Structure des recommandations

| Reco # | Crisp | Alan | BM | Malt | WTTJ | Plausible | Cal | Shine | Pitch |
|--------|-------|------|----|------|------|-----------|-----|-------|-------|
| 1 (HIGH) | Schema SoftApp | Schema Service+FAQ | Structure contenu | Schema plateforme | Schema JSON-LD | Schema SoftApp | Schema SoftApp | Schema metier | Schema SoftApp |
| 2 | Contenu textuel | Fraicheur | Schema Product | Autorite | Fraicheur | Contenu textuel | Fraicheur | Fraicheur | Fraicheur |
| 3 | Fraicheur | Autorite | Fraicheur | Fraicheur | Autorite | Fraicheur | Structure IA | Crawlabilite | Crawlabilite |

**Constat : La reco #1 est TOUJOURS un schema JSON-LD.**

Sur 9 rapports, 8 ont "Ajouter schema X" en priorite haute #1. C'est un pattern repetitif. La raison : le critere "Donnees structurees" est systematiquement le plus faible (0-3/10 sur la plupart des sites). Le scoring pousse donc toujours cette reco en premier.

**Est-ce un probleme ?**
- D'un cote, c'est factuellement correct — la majorite des sites n'ont pas de SoftwareApplication ou FAQPage.
- De l'autre, si un client voit 10 rapports Detekia et que TOUS disent "ajoutez un schema JSON-LD", ca donne l'impression que le produit dit toujours la meme chose.
- BackMarket est l'exception (score 8/10 en schemas) et sa reco #1 est differente ("Optimiser structure contenu principal"). Ca montre que le systeme s'adapte quand le schema est deja bon.

**Recommandation :** Ce n'est pas un bug, mais ca meriterait une diversification de la top priorite. Par exemple, si le score schemas est deja a 3/10 mais que l'autorite est a 2/15, l'autorite devrait etre prioritaire.

### Formulation des verdicts

| Site | Debut du verdict |
|------|-----------------|
| Crisp | "presente une base SEO solide...mais necessite imperativement l'implementation du schema..." |
| Alan | "presente une base solide...mais necessite imperativement l'implementation des schemas..." |
| Malt | "dispose d'une base de contenu solide mais doit prioritairement implementer les schemas..." |
| WTTJ | "presente une base documentaire solide mais necessite urgemment l'implementation de schemas..." |
| Plausible | "presente une base SEO solide...mais l'implementation du schema SoftwareApplication..." |
| Cal | "presente des bases techniques solides mais necessite l'implementation urgente d'un schema..." |
| Shine | "presente une base technique solide mais doit prioritairement implementer les schemas..." |
| Pitch | "presente une base technique solide mais necessite prioritairement l'implementation du schema..." |

**Constat : 8 verdicts sur 9 suivent le meme pattern "base solide MAIS schema manquant".**

C'est repetitif. Un consultant SEO qui teste 3 sites verra le meme verdict 3 fois. Ca reduit la perception de valeur du produit.

**Cause :** Le prompt demande un verdict en 1 phrase. L'IA identifie toujours le schema comme le quick win et structure le verdict autour.

**Recommandation :** Diversifier le prompt pour forcer l'IA a commencer par l'element le plus UNIQUE du site au lieu de toujours mentionner le schema. Ou ajouter une contrainte "ne mentionne pas les schemas dans le verdict si le score est > 0".

### Distribution des scores

| Plage | Sites | Noms |
|-------|-------|------|
| 70-100 | 1 | BackMarket (77) |
| 60-69 | 5 | Crisp (69), Plausible (69), Shine (67), Cal (64), Pitch (64) |
| 50-59 | 2 | Alan (55), Malt (54) |
| 40-49 | 1 | WTTJ (41) |
| < 40 | 0 | — |
| BLOQUE | 1 | Doctolib |

**Constat : 5 sites sur 9 sont dans la meme plage 64-69.**

La distribution est concentree. Les scores se ressemblent beaucoup entre des sites tres differents (Crisp chat vs Plausible analytics vs Shine banque). Ca peut donner l'impression que le scoring ne discrimine pas assez.

**Cause :** Le critere "Crawlabilite IA" donne systematiquement 8/15 a tous les sites (condition: contenu > 5000 chars + indexable). C'est un plafond de verre. Et le scoring ne valorise pas les specificites sectorielles.

### Volume de code fourni

| Site | Blocs de code |
|------|--------------|
| Crisp | 2 |
| Alan | 4 |
| BackMarket | 7 |
| Malt | 3 |
| WTTJ | 1 |
| Plausible | 2 |
| Cal | 2 |
| Shine | 1 |
| Pitch | 2 |

**Constat : BackMarket a 7 blocs de code, WTTJ et Shine n'en ont que 1.**

La quantite de code varie significativement. Les sites avec plus de contenu et de schemas detectes generent plus de code actionnable. Les sites pauvres en contenu (WTTJ: 296 mots) produisent des recommandations plus generiques avec moins de code.

**Est-ce un probleme ?** Non, c'est logique — plus de contenu = plus de contexte = code plus specifique. Mais le client WTTJ qui paie 29 EUR recoit nettement moins de valeur concrete que le client BackMarket.

---

## BUGS RESTANTS IDENTIFIES

### Bug 1 — Faux positif liens sociaux (pixels tracking)
**Site :** cal.com
**Description :** Un pixel Twitter Analytics (analytics.twitter.com/...) est detecte comme lien social. Le score "Presence externe" est gonfle de +2 points.
**Cause :** Le regex verifie juste si l'URL contient "twitter.com" sans exclure les sous-domaines de tracking.
**Fix :** Exclure analytics.twitter.com, t.co/tracking, etc.

### Bug 2 — Corporation non reconnue comme medium-value schema
**Site :** alan.com
**Description :** Le schema "Corporation" (sous-type d'Organization) n'est pas dans la liste medValueTypes du scoring. Score 1/10 au lieu de 3/10.
**Fix :** Ajouter "Corporation", "LocalBusiness", "GovernmentOrganization" etc. comme variantes d'Organization dans medValueTypes.

### Bug 3 — Crawlabilite plafonnee a 8/15 pour tous les sites
**Sites :** TOUS (9/9 ont exactement 8/15)
**Description :** Le scoring crawlabilite donne 8/15 des qu'un site a du contenu > ~5000 chars et est indexable. Il ne differencie pas un site avec 7000 chars d'un site avec 91000 chars. Il ne prend pas en compte le sitemap, les bots IA autorises, etc.
**Impact :** Score identique pour des sites tres differents en crawlabilite reelle.

---

## TOP 5 ACTIONS AVANT COLD MAILING

1. **Diversifier les verdicts.** 8/9 verdicts identiques ("base solide mais schema"). Modifier le prompt pour forcer un verdict specifique au site, pas generique.

2. **Fixer le faux positif tracking Twitter.** Exclure analytics.twitter.com et les pixels de tracking de la detection de liens sociaux.

3. **Ajouter Corporation aux medium-value schemas.** Alan score 1/10 au lieu de 3/10 a cause de ca.

4. **Ameliorer le scoring Crawlabilite.** 9/9 sites a 8/15 = pas de discrimination. Prendre en compte : taille contenu, sitemap, bots IA autorises dans robots.txt, presence llms.txt.

5. **Fixer le seuil minimum de contenu plus haut.** WTTJ genere un rapport sur 296 mots. C'est au-dessus du seuil actuel (100 mots) mais le rapport est pauvre. Envisager un seuil a 300-500 mots avec un warning explicite si entre 100 et 500.
