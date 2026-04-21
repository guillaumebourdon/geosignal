import { ImageResponse } from '@vercel/og';
import { articles } from '../../lib/articles';

export const config = { runtime: 'edge' };

const CATEGORY_COLORS = {
  GUIDE: '#10A37F',
  TECHNIQUE: '#4285F4',
  'STRATÉGIE': '#D97757',
};

const CATEGORY_LABELS = {
  GUIDE: { fr: 'Guide', en: 'Guide' },
  TECHNIQUE: { fr: 'Technique', en: 'Technical' },
  'STRATÉGIE': { fr: 'Stratégie', en: 'Strategy' },
};

// Load Google Fonts at the edge — cached by Vercel after first request
const fontBold = fetch(
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap&text=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%C3%A0%C3%A2%C3%A7%C3%A8%C3%A9%C3%AA%C3%AB%C3%AE%C3%AF%C3%B4%C3%B9%C3%BB%C3%BC%C5%93%C3%86%C3%80%C3%89%C3%88%C3%8A%C3%8B%C3%8E%C3%8F%C3%94%C3%99%C3%9B%C3%9C%E2%80%99%E2%80%98:+%E2%80%94%E2%80%93!%3F%2C.%23%25%C2%AB%C2%BB%E2%80%A6()/%26'
).then((res) => res.text())
  .then((css) => {
    const url = css.match(/src: url\((.+?)\)/)?.[1];
    if (!url) throw new Error('Font URL not found');
    return fetch(url).then((r) => r.arrayBuffer());
  });

const fontRegular = fetch(
  'https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap&text=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789detekia.fr'
).then((res) => res.text())
  .then((css) => {
    const url = css.match(/src: url\((.+?)\)/)?.[1];
    if (!url) throw new Error('Font URL not found');
    return fetch(url).then((r) => r.arrayBuffer());
  });

export default async function handler(req) {
  try {
    const [boldData, regularData] = await Promise.all([fontBold, fontRegular]);

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const locale = searchParams.get('locale') || 'fr';
    const article = articles.find((a) => a.slug === slug);

    const localized = article ? (article[locale] || article.fr) : null;
    const title = localized?.title || (locale === 'en' ? 'Detekia — AI Visibility Audit' : 'Detekia — Audit de visibilité IA');
    const category = article?.category || 'GUIDE';
    const accent = CATEGORY_COLORS[category] || '#D97757';
    const categoryLabel = CATEGORY_LABELS[category]?.[locale] || category;

    // Adaptive font size: shorter titles get larger text
    const titleLen = title.length;
    const fontSize = titleLen > 80 ? 46 : titleLen > 55 ? 52 : 58;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#1A1916',
            display: 'flex',
            flexDirection: 'column',
            padding: '60px 72px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative gradient circle */}
          <div
            style={{
              position: 'absolute',
              bottom: '-180px',
              right: '-120px',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              background: accent,
              opacity: 0.07,
              display: 'flex',
            }}
          />
          {/* Subtle top-left accent */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              left: '-60px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: '#F7F5F2',
              opacity: 0.02,
              display: 'flex',
            }}
          />

          {/* Header: Logo + Category badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', width: '32px', gap: '3px' }}>
                <div style={{ background: '#10A37F', borderRadius: '50%', width: '14px', height: '14px', display: 'flex' }} />
                <div style={{ background: '#D97757', borderRadius: '50%', width: '14px', height: '14px', display: 'flex' }} />
                <div style={{ background: '#4285F4', borderRadius: '50%', width: '14px', height: '14px', display: 'flex' }} />
                <div style={{ background: '#1C7DC4', borderRadius: '50%', width: '14px', height: '14px', display: 'flex' }} />
              </div>
              <div style={{ color: '#F7F5F2', fontSize: '30px', fontFamily: 'Playfair Display', fontWeight: 700, display: 'flex' }}>
                Detekia
              </div>
            </div>

            {/* Category badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: accent + '20',
                border: `1px solid ${accent}40`,
                color: accent,
                padding: '6px 20px',
                borderRadius: '999px',
                fontSize: '15px',
                fontFamily: 'Inter',
                fontWeight: 400,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
              }}
            >
              {categoryLabel}
            </div>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1, display: 'flex' }} />

          {/* Title */}
          <div
            style={{
              color: '#F7F5F2',
              fontSize: `${fontSize}px`,
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              lineHeight: 1.18,
              letterSpacing: '-1px',
              display: 'flex',
              maxWidth: '1020px',
            }}
          >
            {title}
          </div>

          {/* Accent line + footer */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '36px', gap: '16px' }}>
            <div style={{ width: '64px', height: '3px', background: accent, borderRadius: '2px', display: 'flex' }} />
            <div style={{ color: 'rgba(247,245,242,0.4)', fontSize: '18px', fontFamily: 'Inter', fontWeight: 400, display: 'flex' }}>
              detekia.fr
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'Playfair Display', data: boldData, weight: 700, style: 'normal' },
          { name: 'Inter', data: regularData, weight: 400, style: 'normal' },
        ],
      }
    );
  } catch (e) {
    console.error('OG image generation failed:', e.message);
    // Fallback: redirect to static OG image
    return new Response(null, {
      status: 302,
      headers: { Location: 'https://detekia.fr/og-default.png' },
    });
  }
}
