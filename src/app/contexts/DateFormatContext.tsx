'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import type { Locale } from '../i18n/LanguageContext';

export type DateFormatPreference = 'mm/dd/yyyy' | 'dd/mm/yyyy' | 'long';

const STORAGE_KEY = 'dateFormat';

const localeToIntl: Record<Locale, string> = {
  en: 'en-US',
  pt: 'pt-BR',
  es: 'es-ES',
};

interface DateFormatContextType {
  dateFormat: DateFormatPreference;
  setDateFormat: (format: DateFormatPreference) => void;
  formatDate: (isoDate: string, locale?: Locale) => string;
}

const DateFormatContext = createContext<DateFormatContextType>({
  dateFormat: 'mm/dd/yyyy',
  setDateFormat: () => {},
  formatDate: (d) => new Date(d).toLocaleDateString(),
});

export function DateFormatProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [dateFormat, setDateFormatState] = useState<DateFormatPreference>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as DateFormatPreference | null;
      if (stored && ['mm/dd/yyyy', 'dd/mm/yyyy', 'long'].includes(stored)) {
        return stored;
      }
    }
    return 'mm/dd/yyyy';
  });

  const setDateFormat = useCallback((format: DateFormatPreference) => {
    setDateFormatState(format);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, format);
    }
  }, []);

  const formatDate = useCallback((isoDate: string, locale: Locale = 'en') => {
    const date = new Date(isoDate);
    const intlLocale = localeToIntl[locale];

    if (dateFormat === 'long') {
      return date.toLocaleDateString(intlLocale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      });
    }
    if (dateFormat === 'dd/mm/yyyy') {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
      });
    }
    // mm/dd/yyyy (default)
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }, [dateFormat]);

  const value = useMemo(
    () => ({ dateFormat, setDateFormat, formatDate }),
    [dateFormat, setDateFormat, formatDate]
  );

  return (
    <DateFormatContext.Provider value={value}>
      {children}
    </DateFormatContext.Provider>
  );
}

export function useDateFormat() {
  return useContext(DateFormatContext);
}
