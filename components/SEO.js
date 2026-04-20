import Head from 'next/head';
import { useRouter } from 'next/router';

const SITE_URL = 'https://detekia.fr';

export default function SEO({ title, description, image, schema }) {
  const { locale = 'fr', asPath } = useRouter();
  const path = asPath.split('?')[0].split('#')[0];
  const ogLocale = locale === 'fr' ? 'fr_FR' : 'en_US';
  const canonical = `${SITE_URL}${locale === 'fr' ? '' : '/en'}${path === '/' ? '' : path}`;
  const frUrl = `${SITE_URL}${path === '/' ? '' : path}`;
  const enUrl = `${SITE_URL}/en${path === '/' ? '' : path}`;
  const ogImage = image || `${SITE_URL}/og-default.png`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Canonical + hreflang */}
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="fr" href={frUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={frUrl} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  );
}
