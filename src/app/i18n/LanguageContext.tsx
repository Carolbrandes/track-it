'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import en, { Translations } from './locales/en';
import es from './locales/es';
import pt from './locales/pt';

export type Locale = 'en' | 'pt' | 'es';

const locales: Record<Locale, Translations> = { en, pt, es };

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  pt: 'PT',
  es: 'ES',
};

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  t: en,
  setLocale: () => {},
});

export function LanguageProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof globalThis.window !== 'undefined') {
      return (localStorage.getItem('locale') as Locale) || 'en';
    }
    return 'en';
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof globalThis.window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  }, []);

  const t = locales[locale];

  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t, setLocale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
