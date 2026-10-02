import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locale/en.json';
import es from './locale/es.json';

export const I18N_NAMESPACES = [
  'common',
  'auth',
  'nav',
  'pos',
  'vouchers',
  'payroll',
  'inventory',
  'notifications',
  'errors',
  'confirm',
  'status',
  'users',
  'services',
  'roles',
  'profile',
  'history',
] as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      es,
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    ns: [...I18N_NAMESPACES],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
