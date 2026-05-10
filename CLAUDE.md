# Detekia — Instructions Claude Code

## Projet

Detekia (detekia.fr) est un outil de visibilité IA pour les entreprises. Le site est un projet Next.js déployé sur Vercel.

## Offre "Présence IA" — Monitoring de marque dans les LLMs

L'outil Présence IA se trouve dans un projet séparé : `~/Desktop/geo-monitor/`

### Ce que ça fait

On envoie des requêtes naturelles (ex: "quelle banque propose le meilleur livret d'épargne ?") à 4 LLMs (ChatGPT, Claude, Perplexity, Gemini) et on analyse les réponses pour mesurer :
- **Taux de mention** de la marque client
- **Position** dans les réponses (1er cité, 2e, etc.)
- **Sentiment** (positif/neutre/négatif)
- **Sources web** citées par les LLMs
- **Concurrents** mentionnés à la place du client

### Comment lancer une analyse

```bash
cd ~/Desktop/geo-monitor

# Run complet (nouveau client)
node run.js --client=<slug>

# Run incrémental (ajouter des requêtes à un run existant)
node run-incremental.js --client=<slug> --run <timestamp>

# Régénérer uniquement le rapport (sans relancer les appels LLM)
# → Utiliser le script inline dans docs/architecture-technique.md
```

### Structure d'un client

Chaque client a un dossier `clients/<slug>/` avec :
- `config.json` — Nom, domaine, aliases, concurrents (avec domaines), thèmes, branding
- `queries.json` — Liste de requêtes par thème (format `{ "theme": "...", "query": "..." }`)

Les runs sont dans `clients/<slug>/runs/<timestamp>/` avec : `raw.json`, `analyzed.json`, `narrated.json`, `report.html`

### Créer un nouveau client

1. Créer le dossier `clients/<slug>/`
2. Créer `config.json` avec : client (name, domain, aliases), competitors (name, aliases, domain), themes, branding
3. Créer `queries.json` — ~15 requêtes par thème, formulées naturellement (pas des mots-clés SEO)
4. Lancer `node run.js --client=<slug>`
5. Le rapport est dans `clients/<slug>/runs/<timestamp>/report.html`
6. Déployer : `cp report.html /tmp/<deploy-dir>/index.html && cd /tmp/<deploy-dir> && npx vercel --prod --yes`

### Coût par run

~8€ pour 75 requêtes × 4 LLMs. Extrapoler linéairement.

### Clés API requises (.env)

- `ANTHROPIC_API_KEY` — Claude (analyse + runner + narration)
- `OPENAI_API_KEY` — ChatGPT (runner)
- `PERPLEXITY_API_KEY` — Perplexity (runner)
- `GOOGLE_AI_KEY` — Gemini (runner)

### Guide des requêtes

Voir `~/Desktop/geo-monitor/docs/guide-requetes.md` pour les bonnes pratiques de sélection.

### Présentation commerciale

La présentation Présence IA est sur `detekia.fr/deck-monitor` (fichier : `public/deck-monitor/index.html`).

### Documentation technique complète

Voir `~/Desktop/geo-monitor/docs/architecture-technique.md`
