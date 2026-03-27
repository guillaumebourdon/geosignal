import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Detekia analyse votre site et vous donne un score GEO sur 100 — optimisez votre présence sur ChatGPT, Claude, Gemini et Perplexity en 30 secondes." />
        <meta name="keywords" content="GEO, Generative Engine Optimization, audit GEO, score GEO, optimisation IA, ChatGPT SEO, visibilité IA, référencement IA" />
        <meta name="author" content="Detekia" />
        <meta name="robots" content="index, follow" />
        <meta name="google-site-verification" content="YePnIMt60J4133bRkWArTiV7c4-e_vqwYVELQEzD80I" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://detekia.fr" />
        <meta property="og:title" content="Detekia — Votre site est-il visible par les IA ?" />
        <meta property="og:description" content="Analysez votre présence sur ChatGPT, Claude, Gemini et Perplexity. Score GEO sur 100 + recommandations personnalisées en 30 secondes." />
        <meta property="og:locale" content="fr_FR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Detekia — Votre site est-il visible par les IA ?" />
        <meta name="twitter:description" content="Analysez votre présence sur ChatGPT, Claude, Gemini et Perplexity. Score GEO sur 100 + recommandations personnalisées." />

        {/* Schema.org — ce que les IA lisent en priorité */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Detekia",
            "description": "Outil d'audit GEO (Generative Engine Optimization) qui analyse la visibilité d'un site web sur les moteurs d'IA comme ChatGPT, Claude, Gemini et Perplexity.",
            "url": "https://detekia.fr",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": [
              {
                "@type": "Offer",
                "name": "Analyse gratuite",
                "price": "0",
                "priceCurrency": "EUR"
              },
              {
                "@type": "Offer",
                "name": "Rapport complet",
                "price": "29",
                "priceCurrency": "EUR"
              }
            ],
            "featureList": [
              "Score GEO sur 100",
              "Analyse des 8 critères GEO",
              "Analyse des données structurées",
              "Évaluation de la citabilité",
              "Vérification de la présence externe",
              "Recommandations personnalisées et priorisées"
            ],
            "inLanguage": "fr",
            "publisher": {
              "@type": "Organization",
              "name": "Beeleven SASU",
              "legalName": "Beeleven SASU",
              "url": "https://detekia.fr",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "7 rue Curial",
                "postalCode": "75019",
                "addressLocality": "Paris",
                "addressCountry": "FR"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "hello@detekia.fr",
                "contactType": "customer support"
              }
            }
          })}}
        />

        {/* FAQ Schema — boost GEO massif */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Qu'est-ce que le GEO (Generative Engine Optimization) ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Le GEO est l'optimisation d'un site web pour apparaître dans les réponses des intelligences artificielles génératives comme ChatGPT, Claude, Gemini et Perplexity. C'est l'équivalent du SEO mais pour les moteurs d'IA."
                }
              },
              {
                "@type": "Question",
                "name": "Comment améliorer la visibilité de mon site sur les IA ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pour améliorer votre visibilité sur les IA, il faut : ajouter des données structurées Schema.org, rédiger un contenu clair et factuel facilement citable, structurer votre site avec des pages About, Contact et Blog, et développer votre présence externe sur des sites d'autorité."
                }
              },
              {
                "@type": "Question",
                "name": "Qu'est-ce qu'un bon score GEO ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sur Detekia, un score GEO supérieur à 70/100 est considéré comme bon. Entre 45 et 70 est moyen, en dessous de 45 est faible. La majorité des sites analysés obtiennent un score inférieur à 60/100."
                }
              },
              {
                "@type": "Question",
                "name": "Combien coûte un audit GEO avec Detekia ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "L'analyse de base est gratuite et sans inscription : score GEO sur 100, analyse des 8 critères, 1 recommandation experte en aperçu. Le rapport complet avec toutes les recommandations détaillées est disponible à 29 €, paiement unique."
                }
              }
            ]
          })}}
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
