import { useRouter } from 'next/router';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, asPath } = router;

  function switchLocale(newLocale) {
    if (newLocale !== locale) {
      router.push(asPath, asPath, { locale: newLocale });
    }
  }

  const base = {
    fontSize: 12,
    fontFamily: 'system-ui',
    padding: '4px 8px',
    borderRadius: 6,
    border: '1px solid #E5E2DC',
    cursor: 'pointer',
    background: 'transparent',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {['fr', 'en'].map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          style={{
            ...base,
            fontWeight: locale === l ? 700 : 400,
            color: locale === l ? '#1A1916' : '#6B6762',
            background: locale === l ? '#F0EDE8' : 'transparent',
            borderColor: locale === l ? '#D5D0CA' : '#E5E2DC',
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
