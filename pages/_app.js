import '../styles/globals.css';
import CookieBanner from '../components/CookieBanner';
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <CookieBanner />
      <Analytics />
    </>
  );
}
