import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, locale: ctx.locale || 'fr' };
  }

  render() {
    return (
      <Html lang={this.props.locale}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="author" content="Detekia" />
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
          <meta name="google-site-verification" content="YePnIMt60J4133bRkWArTiV7c4-e_vqwYVELQEzD80I" />

          {/* Google Analytics 4 — consent-aware */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-79M2G4CP1C" />
          <script dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              analytics_storage: 'denied'
            });
            gtag('js', new Date());
            gtag('config', 'G-79M2G4CP1C');
            try {
              if (localStorage.getItem('detekia-cookies') === 'accepted') {
                gtag('consent', 'update', { analytics_storage: 'granted' });
              }
            } catch(e) {}
          `}} />

          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" type="image/png" href="/favicon-32.png" sizes="32x32" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
