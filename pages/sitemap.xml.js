import { articles } from '../lib/articles';

const SITE_URL = 'https://detekia.fr';

function hreflangBlock(frPath) {
  const frUrl = `${SITE_URL}${frPath}`;
  const enUrl = `${SITE_URL}/en${frPath}`;
  return `    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${frUrl}" />`;
}

function urlEntry(path, locale, { changefreq, priority, lastmod }) {
  const loc = locale === 'en' ? `${SITE_URL}/en${path}` : `${SITE_URL}${path}`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${hreflangBlock(path)}
  </url>`;
}

function generateSiteMap() {
  const staticPages = [
    { path: '', changefreq: 'weekly', priority: '1.0' },
    { path: '/pricing', changefreq: 'monthly', priority: '0.8' },
    { path: '/monitor', changefreq: 'monthly', priority: '0.8' },
    { path: '/methodologie', changefreq: 'monthly', priority: '0.8' },
    { path: '/a-propos', changefreq: 'monthly', priority: '0.7' },
    { path: '/contact', changefreq: 'monthly', priority: '0.7' },
    { path: '/blog', changefreq: 'daily', priority: '0.9' },
    { path: '/pro', changefreq: 'monthly', priority: '0.7' },
    { path: '/one-page', changefreq: 'monthly', priority: '0.7' },
  ];

  const today = new Date().toISOString().split('T')[0];

  const staticEntries = staticPages.flatMap(p =>
    ['fr', 'en'].map(locale =>
      urlEntry(p.path, locale, { ...p, lastmod: today })
    )
  );

  const blogEntries = articles.flatMap(a =>
    ['fr', 'en'].map(locale =>
      urlEntry(`/blog/${a.slug}`, locale, {
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: a.date || today,
      })
    )
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticEntries, ...blogEntries].join('\n')}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSiteMap();
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
  res.write(sitemap);
  res.end();
  return { props: {} };
}

export default function Sitemap() {}
