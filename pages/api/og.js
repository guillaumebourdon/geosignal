import { ImageResponse } from '@vercel/og';
import { articles } from '../../lib/articles';

export const config = { runtime: 'edge' };

const CATEGORY_COLORS = {
  GUIDE: '#10A37F',
  TECHNIQUE: '#4285F4',
  STRATÉGIE: '#D97757',
};

export default function handler(req) {
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
          fontFamily: 'sans-serif',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: accent,
            opacity: 0.18,
            filter: 'blur(40px)',
            display: 'flex',
          }}
        />

        {/* Header — logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, width: 36, height: 36 }}>
            {['#10A37F', '#D97757', '#4285F4', '#1C7DC4'].map((c) => (
              <div key={c} style={{ background: c, borderRadius: '50%', width: 15, height: 15, display: 'flex' }} />
            ))}
          </div>
          <div style={{ color: '#F7F5F2', fontSize: 36, fontWeight: 700, display: 'flex' }}>Detekia</div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: 'flex' }} />

        {/* Category badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: `${accent}24`,
            border: `1px solid ${accent}55`,
            color: accent,
            padding: '8px 18px',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: 'uppercase',
            alignSelf: 'flex-start',
            marginBottom: 28,
          }}
        >
          {category}
        </div>

        {/* Title */}
        <div
          style={{
            color: '#F7F5F2',
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: -1.5,
            display: 'flex',
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: 'rgba(247,245,242,0.5)', fontSize: 22, display: 'flex' }}>detekia.fr</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
