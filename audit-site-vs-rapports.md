# Audit complet — Site Detekia vs Rapports livrés

Date : 26 avril 2026
Périmètre : toutes les pages du site detekia.fr, templates de rapports, emails, documents techniques

---

## 1. RÉSUMÉ EXÉCUTIF

| Dimension | Problèmes |
|-----------|-----------|
| Véracité | 7 problèmes (2 critiques, 3 importants, 2 optimisations) |
| Cohérence interne | 5 problèmes (1 critique, 3 importants, 1 optimisation) |
| Cohérence site↔rapports | 4 problèmes (1 important, 3 optimisations) |
| Manques & opportunités | 8 opportunités identifiées |
| **Total** | **24 items** |

### Top 5 des problèmes les plus critiques

1. **Page /pro toujours en mode waitlist "juin 2026"** — le Pro est en vente sur /pricing mais /pro dit "arrive bientôt" avec une inscription email. Contradiction visible et confusante.
2. **Témoignages probablement fictifs** — Thomas L./Kairos SaaS, Marine G./consultante, Julien B./Maison Verdure ne sont pas vérifiables. Scores avant/après (29→58, 34→71) invérifiables. Risque crédibilité majeur.
3. **Stat "1 247 analyses réalisées"** — chiffre figé dans le code, pas dynamique. Probablement obsolète ou inventé. Aucun compteur réel en Redis.
4. **CGU promettent "satisfait ou remboursé 7 jours"** mais /pricing ne le mentionne plus et affiche seulement "Paiement sécurisé via Stripe". Incohérence juridique.
5. **Homepage dit "60 secondes"** pour l'analyse, mais le one-page Sonnet prend 60-65 secondes côté serveur + temps réseau. Timing limite.

### Note globale de cohérence : 6/10

Le site est fonctionnellement solide et le produit tient ses promesses techniques principales (8 critères, score /100, rapport web, PDF). Les problèmes sont concentrés sur le marketing (témoignages, stats figées, page /pro obsolète) et des incohérences de wording mineures entre pages.

---

## 2. PROBLÈMES PAR PAGE

### / (Homepage)

**Affirmations validées (9)** : 8 critères ✓, score /100 ✓, gratuit sans inscription ✓, analyse de la page de votre choix ✓, recommandations ✓, PDF ✓, méthodologie Princeton ✓, rapport web ✓, GPTBot/ClaudeBot autorisés ✓

| # | Affirmation | Statut | Détail |
|---|-------------|--------|--------|
| H1 | "1 247 analyses réalisées" | **IMPRÉCIS** | Chiffre hardcodé dans fr.json, pas de compteur dynamique. Peut être obsolète ou inventé. |
| H2 | "38/100 score moyen observé" | **NON VÉRIFIABLE** | Même problème — hardcodé, pas calculé depuis les données réelles. |
| H3 | "en moins de 60 secondes" (step 3) | **IMPRÉCIS** | Sonnet prend 60-65s. C'est juste avec Haiku mais plus avec Sonnet. Devrait dire "1 à 2 minutes". |
| H4 | "en 60 secondes" (hero subtitle) | **IMPRÉCIS** | Même problème. |
| H5 | Témoignage Thomas L. / Kairos SaaS | **NON VÉRIFIABLE** | Aucune preuve que ce client existe. "Kairos SaaS" non trouvable en ligne. |
| H6 | Témoignage Marine G. / Consultante SEO | **NON VÉRIFIABLE** | Idem. |
| H7 | Témoignage Julien B. / Maison Verdure | **NON VÉRIFIABLE** | Idem. |
| H8 | "Débloquer mon rapport — 29 €" dans la section rapport | **VRAI** | Correct, redirige vers /pricing. |
| H9 | "Accès immédiat" (sous le CTA 29€) | **IMPRÉCIS** | Le rapport prend 1-2 min, pas immédiat. L'accès au rapport web est immédiat une fois l'email reçu. |

**Manques détectés :**
- Aucune mention du Pro 99€ sur la homepage (pas de section "Nos audits")
- Aucune mention des "30 requêtes IA" du Pro
- Les stats pourraient être dynamiques (compteur Redis)

---

### /pricing

**Affirmations validées (12)** : 3 plans ✓, 0€/29€/99€ ✓, paiement unique ✓, 8 critères ✓, 10 requêtes IA (one-page) ✓, 30 requêtes (Pro) ✓, 20 pages (Pro) ✓, patterns transverses ✓, plan d'action ✓, PDF ✓, rapport web permanent ✓, Stripe ✓

| # | Affirmation | Statut | Détail |
|---|-------------|--------|--------|
| P1 | "Score /100 détaillé" (29€) | **VRAI** | ✓ |
| P2 | "8 recommandations avec exemples de code" (29€) | **VRAI** | Le prompt demande "EXACTLY 8" et le code le génère. ✓ |
| P3 | "Rapport web accessible pour toujours" | **IMPRÉCIS** | TTL Redis = 10 ans, pas "pour toujours". 10 ans ≈ toujours en pratique. Acceptable. |
| P4 | "15 actions" (Pro plan d'action) | **IMPRÉCIS** | Le prompt demande "10 to 15", le résultat varie. Derniers tests : 10-15 actions. |
| P5 | "Score moyen /100 sur 20 pages" (Pro) | **VRAI** quand le sitemap fonctionne. Peut être 1 page si le sitemap est bloqué (bug PSG corrigé). |
| P6 | FAQ "L'audit gratuit et l'audit 1 page : 30 secondes" | **FAUX** | L'audit gratuit est ~30s (analyseur léger). L'audit 1 page payant prend 60-65s avec Sonnet. |
| P7 | FAQ "L'audit complet : 10-15 minutes" | **FAUX** | Les 3 derniers runs réels : 15.2, 16.5, 15.6 min. /success dit correctement "15 à 20 min". |
| P8 | "Bilan détaillé par page" (Pro) | **VRAI** | Section annexe avec les 20 pages, scores, top 3 faiblesses. ✓ |

**Incohérences :**
- FAQ dit "30 secondes" pour le 29€ mais /success dit "1 à 2 minutes". **Contradiction visible.**
- FAQ dit "10-15 minutes" pour le Pro mais /success dit "15 à 20 minutes". **Contradiction visible.**

**Manque :** Pas de "satisfait ou remboursé" sur /pricing alors que les CGU le promettent.

---

### /pro

| # | Problème | Gravité |
|---|----------|---------|
| PRO1 | Page entière est un teaser waitlist : "Detekia Pro arrive bientôt", "Lancement prévu : juin 2026", formulaire d'inscription email | **CRITIQUE** |
| PRO2 | Le Pro est DÉJÀ en vente sur /pricing à 99€ | **CRITIQUE** |
| PRO3 | Contradiction directe : /pricing vend le Pro, /pro dit qu'il n'existe pas encore | **CRITIQUE** |

**Fix nécessaire :** Soit transformer /pro en vraie landing page produit, soit rediriger /pro vers /pricing#pro.

---

### /methodologie

**Affirmations validées (8)** : 8 critères nommés correctement ✓, poids corrects (25+20+15+15+10+10+5+5=105... wait)

| # | Affirmation | Statut | Détail |
|---|-------------|--------|--------|
| M1 | Poids des critères | **À VÉRIFIER** | Le total des max est 25+20+15+15+10+10+5+5 = 105, pas 100. Le score est normalisé à 100 via le bonus neutralité (qui ajoute -3 à +3). La page ne l'explique pas. |

**Manque :** Pas d'explication du bonus neutralité qui fait que le total peut dépasser 100 avant normalisation.

---

### /a-propos

Contenu cohérent. Pas de problème détecté. Guillaume Bourdon identifié comme fondateur, Beeleven SASU mentionné, mission claire.

---

### /contact

Contenu cohérent. Schema ContactPoint en place. Email hello@detekia.fr correct.

---

### /success

| # | Affirmation | Statut |
|---|-------------|--------|
| S1 | "1 à 2 minutes" (one-page) | **VRAI** — timing réel ~65s + finalisation ~5s |
| S2 | "15 à 20 minutes" (Pro) | **VRAI** — timing réel 15-17 min |
| S3 | "Vous pouvez fermer cette page" | **VRAI** — analyse en fire-and-forget |
| S4 | "Pensez à vérifier vos spams" | **VRAI** et visible |

Pas de problème détecté sur /success. ✓

---

### Emails transactionnels

| # | Affirmation | Statut |
|---|-------------|--------|
| E1 | Email one-page : "Votre rapport GEO complet est prêt" | **IMPRÉCIS** — le mot "complet" peut prêter à confusion avec le Pro. Devrait dire "Votre rapport GEO est prêt". |
| E2 | Email Pro : mention du nombre de pages, patterns, actions | **VRAI** ✓ |
| E3 | Email one-page : upsell Pro en bas | **VRAI** — "Envie d'une vision globale ?" ✓ |
| E4 | Expéditeur "Detekia <hello@detekia.fr>" | **VRAI** ✓ |

---

### CGU

| # | Problème | Gravité |
|---|----------|---------|
| CGU1 | "Satisfait ou remboursé 7 jours" promis dans les CGU mais ABSENT de /pricing | **IMPORTANT** — soit l'ajouter sur /pricing, soit le retirer des CGU |

---

### /robots.txt, /llms.txt, sitemap

Tous cohérents. Sitemap pointe vers detekia.fr ✓. robots.txt autorise les bots IA ✓. llms.txt liste toutes les pages et articles ✓.

---

## 3. PROBLÈMES TRANSVERSES

### Timing incohérent

| Page | Claim one-page | Claim Pro |
|------|---------------|-----------|
| Homepage | "60 secondes" | — |
| /pricing FAQ | "30 secondes" | "10-15 minutes" |
| /success | "1 à 2 minutes" | "15 à 20 minutes" |
| Email | — | — |

**Le /success a les bonnes valeurs.** Les autres pages doivent s'aligner.

### "Rapport complet" ambigu

Le mot "complet" est utilisé pour les deux produits :
- Homepage : "rapport GEO complet" = le one-page
- Email one-page : "rapport GEO complet"
- Pricing : "audit complet" = le Pro

Confusion possible. Le one-page devrait utiliser "rapport GEO" ou "rapport détaillé", et réserver "complet" au Pro.

### Page /pro en contradiction totale

/pricing vend le Pro. /pro dit qu'il arrive en juin 2026. Les deux pages sont accessibles. Un visiteur qui navigue verra la contradiction.

---

## 4. RAPPORT EN DÉTAIL — CE QUE LE SITE NE DIT PAS

### Features livrées mais non marketées

| Feature | Présent dans le rapport | Mentionné sur le site | Impact si ajouté |
|---------|------------------------|----------------------|-----------------|
| Score projeté après optimisation | ✓ (one-page + Pro) | ❌ Jamais mentionné | **Élevé** — argument de vente puissant ("passez de 38 à 65/100") |
| Concurrents cités à votre place (test IA) | ✓ (avec noms des concurrents) | ❌ | **Élevé** — trigger émotionnel fort |
| Cas réels documentés sur les 3 critères faibles | ✓ | ❌ | Moyen — enrichit le pitch "preuves concrètes" |
| Validation automatique (reportValidator) | ✓ | ❌ | Moyen — argument de qualité/fiabilité |
| Détection de patterns inter-pages (Pro) | ✓ Mentionné sur /pricing | Partiellement | Faible (déjà mentionné) |
| Bilan détaillé par page avec top 3 actions (Pro) | ✓ | ✓ Mentionné | Faible |
| Contexte 2026 avec 6 stats sourcées | ✓ dans chaque rapport | ❌ | Moyen — montre la profondeur |
| Guide technique par critère | ✓ | ❌ | Moyen |

### Suggestions de wording

- **Score projeté** : "Découvrez votre score GEO actuel ET le score projeté si vous appliquez nos recommandations." → Ajouter sur /pricing dans les features du one-page et Pro.
- **Concurrents** : "Voyez quels concurrents apparaissent à votre place dans les réponses IA." → Ajouter sur la homepage section rapport.
- **Cas réels** : "Chaque critère faible est illustré par un cas réel documenté (avec sources)." → Ajouter sur /pricing features.

---

## 5. CHIFFRES À VÉRIFIER OU CORRIGER

| Chiffre | Page | Statut | Action |
|---------|------|--------|--------|
| "1 247 analyses" | Homepage | **IMPRÉCIS** — hardcodé | Rendre dynamique ou retirer |
| "38/100 score moyen" | Homepage | **NON VÉRIFIABLE** — hardcodé | Idem |
| "60 secondes" | Homepage (hero + step 3) | **IMPRÉCIS** | Changer en "1 à 2 minutes" |
| "30 secondes" (audit gratuit) | /pricing | **VRAI** pour le gratuit | OK |
| "30 secondes" (audit 29€) | /pricing FAQ | **FAUX** | Changer en "1 à 2 minutes" |
| "10-15 minutes" (Pro) | /pricing FAQ | **IMPRÉCIS** | Changer en "15 à 20 minutes" |
| "8 recommandations" | /pricing | **VRAI** | ✓ |
| "10 requêtes IA" | /pricing (one-page) | **VRAI** | ✓ |
| "30 requêtes IA" | /pricing (Pro) | **VRAI** | ✓ |
| "20 pages" | /pricing (Pro) | **VRAI** (quand sitemap OK) | ✓ |
| "15 actions" | /pricing (Pro) | **IMPRÉCIS** — varie 10-15 | Changer en "10 à 15 actions" |
| "+527%" trafic IA | Rapport contexte 2026 | **VRAI** — source Previsible 2025 | ✓ |
| "2,5 Mds" requêtes ChatGPT | Rapport | **VRAI** — source Search Engine Land 2026 | ✓ |
| "4,4x" conversion IA | Rapport | **VRAI** — source Semrush 2025 | ✓ |
| "80%" URLs hors top 100 | Rapport | **VRAI** — source Ahrefs 2025 | ✓ |
| "Princeton/KDD 2024" | Partout | **VRAI** — Aggarwal et al. | ✓ |
| Score total 105 pts (pas 100) | /methodologie | **IMPRÉCIS** — non expliqué | Ajouter note sur la normalisation |

---

## 6. CRÉDIBILITÉ — POINTS D'ALERTE

### Témoignages fictifs

Les 3 témoignages (Thomas L./Kairos SaaS, Marine G., Julien B./Maison Verdure) présentent des signaux de fabrication :
- Noms abrégés (initiales seulement → impossibles à vérifier)
- Entreprises non vérifiables ("Kairos SaaS", "Maison Verdure" — aucune trace publique)
- Scores avant/après très précis (29→58, 34→71) sans preuve
- Format identique pour les 3 (structurés comme des templates)

**Risque** : Un visiteur attentif (journaliste, concurrent, prospect exigeant) pourrait les identifier comme fictifs. En France, les faux témoignages sont sanctionnés par la DGCCRF (pratique commerciale trompeuse).

**Recommandation** : Remplacer par des vrais témoignages ou retirer la section. Alternatives : screenshots de rapports réels (anonymisés), citations de tweets/LinkedIn publics, logos de sites analysés.

### Stat "1 247 analyses" figée

Chiffre hardcodé qui ne bouge jamais. Un visiteur qui revient 1 mois plus tard et voit le même chiffre perd confiance.

**Recommandation** : Soit rendre dynamique (compteur Redis), soit retirer.

---

## 7. PRIORISATION DES CORRECTIONS

### CRITIQUE — à corriger en urgence

| # | Problème | Action |
|---|----------|--------|
| 1 | Page /pro dit "arrive bientôt" alors que le Pro est en vente | Transformer en landing produit OU redirect vers /pricing |
| 2 | Témoignages invérifiables | Remplacer par du vrai social proof ou retirer |
| 3 | CGU promettent "satisfait ou remboursé" non mentionné sur /pricing | Harmoniser (ajouter sur /pricing OU retirer des CGU) |

### IMPORTANT — à corriger cette semaine

| # | Problème | Action |
|---|----------|--------|
| 4 | /pricing FAQ "30 secondes" pour le 29€ | → "1 à 2 minutes" |
| 5 | /pricing FAQ "10-15 minutes" pour le Pro | → "15 à 20 minutes" |
| 6 | Homepage "60 secondes" | → "1 à 2 minutes" |
| 7 | Stat "1 247" hardcodée | Dynamiser ou retirer |
| 8 | Email one-page dit "rapport complet" | → "rapport GEO" (réserver "complet" au Pro) |

### OPTIMISATION — backlog

| # | Problème | Action |
|---|----------|--------|
| 9 | Score projeté non marketé | Ajouter dans les features /pricing |
| 10 | Concurrents cités non marketés | Ajouter dans la section rapport homepage |
| 11 | /pricing dit "15 actions" fixe | → "10 à 15 actions" |
| 12 | /methodologie n'explique pas la normalisation 105→100 | Ajouter note |
| 13 | Cas réels documentés non marketés | Ajouter dans features |
| 14 | Aucune démo de rapport accessible publiquement | Créer un rapport exemple |
