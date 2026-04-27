# Audit Design, UX, Accessibilité & Mobile — Detekia

**Date** : 27 avril 2026
**Périmètre** : Toutes les pages, composants UI, CSS global, responsive, a11y

---

## 1. RÉSUMÉ EXÉCUTIF

**Note design/UX : 8/10** — Design cohérent et professionnel. Palette, typographies et animations sont uniformes. Quelques incohérences mineures entre les pages.

**Note accessibilité : 4/10** — Faiblesses structurelles : pas de `<main>` landmark sur aucune page, pas de focus visible pour la navigation clavier, modales sans focus trap, inputs sans labels, contrastes insuffisants sur le texte secondaire. Non conforme WCAG AA.

**Note mobile : 7.5/10** — Responsive fonctionnel grâce au CSS globals.css bien structuré. Quelques targets tactiles trop petites et des breakpoints intermédiaires (tablette) parfois oubliés.

**Top 5 problèmes les plus impactants :**

1. **CRITIQUE (a11y)** — Aucune page n'a de landmark `<main>` — violation WCAG fondamentale.
2. **CRITIQUE (a11y)** — Aucun style `:focus-visible` — les utilisateurs clavier ne voient pas où ils se trouvent.
3. **IMPORTANT (a11y)** — Contraste insuffisant sur le texte secondaire gris (#8A8680 sur #F7F5F2 = 3.2:1, WCAG AA exige 4.5:1 pour le texte normal).
4. **IMPORTANT (a11y)** — Modales checkout sans focus trap — le Tab échappe de la modale.
5. **IMPORTANT (UX)** — Inputs de formulaires (URL, email) sans `<label>` associé — non accessible aux lecteurs d'écran.

---

## 2. PROBLÈMES PAR PAGE

### Homepage (/) — Design 8/10, Mobile 8/10, A11y 4/10

**Desktop** : Design propre, sections bien rythmées, mockup interactif efficace.
**Mobile** : Hero, stats marquee, sections s'empilent correctement. Footer 3 colonnes responsive.
**A11y** :
- Pas de `<main>`
- Input URL sans `<label>`
- FAQ homepage utilise des divs avec mouse events (pas `<details>`)
- Carousel dots sans `aria-current`
- Bouton burger : target tactile ~22px (devrait être 44px)

### /pricing — Design 8/10, Mobile 7/10, A11y 5/10

**Desktop** : Cards bien différenciées (blanc/dark). FAQ accordion en `<details>` (bon).
**Mobile** : Cards empilées correctement.
**A11y** :
- Modal checkout sans focus trap
- Input URL sans `<label>`
- Erreurs de validation non liées à l'input (`aria-describedby` manquant)
- Close button `×` sans `aria-label`
- Modal manque `aria-labelledby`

### /pro et /one-page — Design 8/10, Mobile 7.5/10, A11y 4/10

**Desktop** : Hero animé avec mockup, sections features bien structurées.
**Mobile** : Mockup redimensionné correctement.
**A11y** : Mêmes problèmes que pricing + FAQ sans FAQPage Schema (corrigé dans le chantier 5).

### /results — Design 7/10, Mobile 7/10, A11y 3/10

**Desktop** : Score bien mis en valeur, sections bien ordonnées.
**A11y** :
- Loading spinner sans `aria-live` pour les mises à jour
- Score non annoncé aux lecteurs d'écran
- Share dropdown non navigable au clavier
- Tooltip info uniquement au hover (pas au focus)
- Checkout modal sans focus trap

### /methodologie — Design 8/10, Mobile 7/10, A11y 5/10

**Desktop** : Tableau comparatif bien stylé, critères en cards interactives.
**Mobile** : Tableau se transforme en cards empilées (bon).

### /a-propos, /contact — Design 7/10, Mobile 7/10, A11y 5/10

Pages simples, peu d'interactivité. Formulaire contact manque de labels.

---

## 3. PROBLÈMES TRANSVERSES

### T1 — Pas de landmark `<main>` (TOUTES les pages)
**Description** : Aucune page n'utilise `<main>`. Le contenu est dans des `<div>`.
**Impact** : Les lecteurs d'écran ne peuvent pas naviguer directement au contenu principal.
**Correction** : Remplacer le `<div>` racine de contenu par `<main>`.
**Effort** : 1h (8 pages à modifier)

### T2 — Pas de focus visible (TOUTES les pages)
**Description** : `globals.css` n'a qu'1 occurrence de `:focus` (dans le carousel). Aucun style `:focus-visible` global.
**Impact** : Navigation clavier impossible visuellement.
**Correction** : Ajouter `*:focus-visible { outline: 2px solid #D97757; outline-offset: 2px; }` dans globals.css.
**Effort** : 15 min

### T3 — Contraste texte secondaire insuffisant
**Description** : `#8A8680` sur `#F7F5F2` = 3.2:1 (WCAG AA exige 4.5:1). Utilisé massivement pour le texte secondaire, descriptions, labels.
**Correction** : Foncer le gris secondaire à `#6B6762` (~4.6:1) ou `#5A5752` (~5.5:1).
**Effort** : 30 min (remplacement global)

### T4 — Texte ultra-petit (8-9px)
**Description** : fontSize 8px et 9px utilisés pour les labels monospace. 86 occurrences totales.
**Impact** : Illisible sur certains écrans, inaccessible.
**Correction** : Minimum 10px pour le monospace, 12px pour le body.
**Effort** : 1h

### T5 — Modales sans focus trap (3 composants)
**Description** : CheckoutFlow, pricing modal, results checkout — le Tab échappe de la modale.
**Correction** : Implémenter un focus trap (package `focus-trap-react` ou custom).
**Effort** : 2h

---

## 4. AUDIT PAR DIMENSION

### D1 — Cohérence visuelle ✅ (8/10)
Palette respectée, typos cohérentes, boutons uniformes, cards animées identiques partout. Quelques variations de padding entre sections.

### D2 — Responsive mobile ✅ (7.5/10)
Breakpoints 767px et 480px bien gérés. Hero, cards, grilles s'empilent. Quelques targets tactiles trop petites (burger 22px, toggle cookie 40×22px).

### D3 — Responsive tablette ⚠️ (6/10)
Pas de breakpoint dédié tablette. Les grilles passent de desktop (3 colonnes) à mobile (1 colonne) sans intermédiaire 2 colonnes pour certaines sections.

### D4 — Accessibilité ❌ (4/10)
Voir détails section 8.

### D5 — UX parcours ✅ (8/10)
- Homepage → scoring gratuit : 1 clic (input dans le hero)
- → achat 29€ : 2-3 clics (hero → results → double CTA)
- → achat 99€ : 2-3 clics
- → méthodologie : 1 clic (nav)
- → contact : 1 clic (nav)
- Cul-de-sac : aucun détecté (toutes les pages ont un CTA ou nav)

### D6 — Animations ✅ (8/10)
Système cohérent (reveal, scale-in, card-interactive, btn-interactive). prefers-reduced-motion géré dans globals.css. Manque sur quelques animations inline (marquee, cookie banner slideUp).

### D7 — Performance ⚠️ (7/10)
TTFB excellent (0.3-0.8s). Images SVG inline (pas de chargement externe). Pas de polices lourdes (system-ui principal). Google Fonts chargées pour l'OG image uniquement (edge function). Code split par Next.js automatiquement.

### D8 — Forms & feedback ⚠️ (6/10)
Inputs sans labels, erreurs non annoncées, spinners basiques. Loaders clairs pendant les soumissions.

### D9 — Cohérence FR/EN ✅ (8/10)
Wording EN natif, pas de traduction littérale. Dates formatées par locale. Language switcher fonctionnel. Quelques textes EN plus longs que FR qui pourraient casser les layouts tight.

### D10 — Éléments UI spécifiques ✅ (7/10)
Cookie banner fonctionnel avec 3 boutons + modale. Toggle switch visuellement clair mais manque d'ARIA. Pré-check spinner visible et message clair.

---

## 5. PROBLÈMES CRITIQUES (avant cold mailing)

| # | Problème | Effort |
|---|---|---|
| 1 | Ajouter `<main>` sur toutes les pages | 1h |
| 2 | Ajouter `:focus-visible` global | 15 min |
| 3 | Foncer le gris secondaire (contraste AA) | 30 min |
| 4 | Labels sur tous les inputs (URL, email) | 30 min |

---

## 6. PROBLÈMES IMPORTANTS (cette semaine)

| 5 | Focus trap dans les modales | 2h |
| 6 | Touch targets 44px minimum | 1h |
| 7 | Minimum font-size 10px (monospace) | 1h |
| 8 | `aria-label` sur les boutons close et icon-only | 30 min |

---

## 7. OPTIMISATIONS (backlog)

| 9 | `role="alert"` sur les messages d'erreur | 30 min |
| 10 | `aria-live` sur le loading du /results | 30 min |
| 11 | Breakpoint tablette dédié (768-1024px) | 2h |
| 12 | Tooltips accessibles au clavier | 1h |
| 13 | `aria-current` sur carousel dots | 15 min |

---

## 8. ACCESSIBILITÉ — DÉTAILS WCAG

### Violations WCAG 2.1 AA identifiées :

| Critère WCAG | Description | Statut |
|---|---|---|
| 1.1.1 Non-text Content | Alt text sur images | ⚠️ Pas d'images `<img>` (SVG inline) — OK |
| 1.3.1 Info and Relationships | Landmarks (`<main>`, `<nav>`) | ❌ `<main>` absent |
| 1.4.3 Contrast (Minimum) | 4.5:1 pour texte normal | ❌ Gris secondaire 3.2:1 |
| 1.4.4 Resize Text | Zoom 200% | ⚠️ Non testé côté code |
| 2.1.1 Keyboard | Navigation clavier complète | ❌ Focus non visible |
| 2.1.2 No Keyboard Trap | Pas de piège clavier | ❌ Modales sans focus trap |
| 2.4.3 Focus Order | Ordre logique | ✅ OK (DOM order) |
| 2.4.7 Focus Visible | Focus visible | ❌ Absent |
| 3.3.1 Error Identification | Erreurs identifiées | ⚠️ Visuellement OK, pas d'ARIA |
| 3.3.2 Labels | Labels sur les inputs | ❌ Absent |
| 4.1.2 Name, Role, Value | ARIA sur les widgets | ⚠️ Partiel |

**Risque juridique** : La conformité WCAG n'est pas légalement obligatoire pour une SaaS privée en France (contrairement aux sites publics). Mais les prospects B2B (agences, consultants) peuvent le remarquer et le juger négativement.

---

## 9. PERFORMANCE (estimations basées sur le code)

Lighthouse non exécuté (pas d'accès navigateur), mais estimation basée sur l'architecture :

| Métrique | Estimation | Verdict |
|---|---|---|
| LCP | ~1.5-2s | ✅ Bon (SSG, pas d'images lourdes) |
| FCP | ~0.8-1.2s | ✅ Bon (HTML pré-rendu) |
| CLS | ~0.05 | ✅ Bon (pas de lazy-load visible) |
| TTI | ~2-3s | ✅ Bon (JS minimal) |
| TTFB | 0.3-0.8s mesuré | ✅ Excellent |

**Performance estimée Lighthouse : 85-95/100** (desktop), **75-85/100** (mobile — JS bundle + fonts).
