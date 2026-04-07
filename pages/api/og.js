import { ImageResponse } from '@vercel/og';
import { articles } from '../../lib/articles';

export const config = { runtime: 'edge' };

const CATEGORY_COLORS = {
  GUIDE: '#10A37F',
  TECHNIQUE: '#4285F4',
  'STRATÉGIE': '#D97757',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const article = articles.find((a) => a.slug === slug);

    const title = article?.title || 'Detekia — Audit de visibilité IA';
    const category = article?.category || 'GUIDE';
    const accent = CATEGORY_COLORS[category] || '#D97757';

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#1A1916',
            display: 'flex',
            flexDirection: 'column',
            padding: '64px 72px',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: '-150px',
              right: '-150px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: accent,
              opacity: 0.06,
              display: 'flex',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '36px', gap: '4px' }}>
              <div style={{ background: '#10A37F', borderRadius: '50%', width: '15px', height: '15px', display: 'flex' }} />
              <div style={{ background: '#D97757', borderRadius: '50%', width: '15px', height: '15px', display: 'flex' }} />
              <div style={{ background: '#4285F4', borderRadius: '50%', width: '15px', height: '15px', display: 'flex' }} />
              <div style={{ background: '#1C7DC4', borderRadius: '50%', width: '15px', height: '15px', display: 'flex' }} />
            </div>
            <div style={{ color: '#F7F5F2', fontSize: '36px', fontWeight: 700, display: 'flex' }}>Detekia</div>
          </div>

          <div style={{ flex: 1, display: 'flex' }} />

          <div style={{ display: 'flex', marginBottom: '28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: accent + '24',
                color: accent,
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '3px',
                textTransform: 'uppercase',
              }}
            >
              {category}
            </div>
          </div>

          <div
            style={{
              color: '#F7F5F2',
              fontSize: '58px',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              display: 'flex',
              maxWidth: '1000px',
            }}
          >
            {title}
          </div>

          <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center' }}>
            <div style={{ color: 'rgba(247,245,242,0.5)', fontSize: '22px', display: 'flex' }}>detekia.fr</div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    return new Response('Error generating image: ' + e.message, { status: 500 });
  }
}
