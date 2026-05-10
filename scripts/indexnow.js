#!/usr/bin/env node
/**
 * Submit all Detekia URLs to Bing via IndexNow API.
 * Usage: node scripts/indexnow.js
 */

const SITE = 'https://detekia.fr';
const KEY = 'edb45b6f44b043e3a41e41a55605a1c8';

// Static pages
const staticPages = [
  '', '/pricing', '/presence-ia', '/methodologie',
  '/a-propos', '/contact', '/blog', '/pro', '/one-page',
  '/results', '/success', '/cgu', '/confidentialite', '/mentions-legales',
];

// Article slugs — keep in sync with lib/articles.js
const articleSlugs = [
  'geo-guide-complet-2026',
  'pourquoi-chatgpt-ne-cite-pas-votre-site',
  'seo-vs-geo-differences-2026',
  'score-geo-mesurer-visibilite-ia',
  'schema-org-ia-guide-pratique',
  'ecommerce-recommandations-ia',
  '8-criteres-geo-methodologie-detekia',
  'llms-txt-robots-crawlabilite-ia',
  'geo-agences-seo-audit-ia',
  'ai-overviews-google-2026',
  'audit-geo-visibilite-ia',
  'reddit-geo-source-ia',
  'concurrents-chatgpt-visibilite',
  'pourquoi-trafic-google-baisse-2026',
  'sites-bloquent-bots-ia',
  'visibilite-ia-guide-debutant',
  'comment-chatgpt-choisit-ses-sources',
  'perplexity-comment-apparaitre',
  'gemini-visibilite-site-france',
  'meta-descriptions-seo-geo-2026',
  'faq-schema-faqpage-combo-ia',
  'contenu-long-vs-court-ia',
  'backlinks-geo-autorite-domaine-ia',
  'sitemap-robots-txt-bots-ia-2026',
  'saas-b2b-chatgpt-recommandations',
  'erreurs-geo-ecommerce',
  'eeat-ia-experience-expertise',
  'sources-contenus-citations-ia',
  'avis-clients-temoignages-visibilite-ia',
  'linkedin-geo-profil-visibilite-ia',
  'pourquoi-ia-adorent-chiffres-contenu-factuel',
];

// Build full URL list
const urls = [];

// Static pages × 2 locales
for (const path of staticPages) {
  urls.push(`${SITE}/fr${path}`);
  urls.push(`${SITE}/en${path}`);
}

// Articles × 2 locales
for (const slug of articleSlugs) {
  urls.push(`${SITE}/fr/blog/${slug}`);
  urls.push(`${SITE}/en/blog/${slug}`);
}

// Root URL
urls.unshift(SITE);

async function submit() {
  console.log(`Submitting ${urls.length} URLs to IndexNow...`);

  // IndexNow accepts max 10,000 URLs per request
  const body = {
    host: 'detekia.fr',
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    console.log(`Response: ${res.status} ${res.statusText}`);

    if (res.status === 200 || res.status === 202) {
      console.log(`✓ ${urls.length} URLs submitted successfully!`);
    } else {
      const text = await res.text();
      console.error('Response body:', text);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }

  console.log('\nURLs submitted:');
  urls.forEach(u => console.log(`  ${u}`));
}

submit();
