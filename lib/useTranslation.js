import { useRouter } from 'next/router';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

const translations = { fr, en };

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function useTranslation() {
  const { locale = 'fr' } = useRouter();
  const t = (key) =>
    getNestedValue(translations[locale], key) ??
    getNestedValue(translations.fr, key) ??
    key;
  return { t, locale };
}
