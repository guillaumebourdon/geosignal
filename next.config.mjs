/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://ct.captcha-delivery.com https://vercel.live https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://region1.google-analytics.com https://vitals.vercel-insights.com https://*.upstash.io https://vercel.live",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "frame-ancestors 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localeDetection: false,
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/demo/:path*', destination: '/demo/:path*', locale: false },
      ],
    };
  },
  async headers() {
    return [
      { source: '/', headers: securityHeaders },
      { source: '/:path*', headers: securityHeaders },
    ];
  },
};

export default nextConfig;
