import { articles } from '../lib/articles';

const SITE_URL = 'https://detekia.fr';

function generateSiteMap() {
  const staticPages = [
    { loc: '', changefreq: 'weekly', priority: '1.0' },
    { loc: '/pricing', changefreq: 'monthly', priority: '0.8' },
    { loc: '/methodologie', changefreq: 'monthly', priority: '0.8' },
    { loc: '/a-propos', changefreq: 'monthly', priority: '0.7' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.7' },
    { loc: '/blog', changefreq: 'daily', priority: '0.9' },
  ];

  const today = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(p => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
${articles.map(a => `  <url>
    <loc>${SITE_URL}/blog/${a.slug}</loc>
    <lastmod>${a.date || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
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
