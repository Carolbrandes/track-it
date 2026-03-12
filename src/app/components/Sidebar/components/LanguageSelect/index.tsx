'use client';

import { MdLanguage } from 'react-icons/md';
import { Locale, localeLabels, useTranslation } from '../../../../i18n/LanguageContext';

const locales: Locale[] = ['en', 'pt', 'es'];

export const LanguageSelect = () => {
    const { locale, setLocale } = useTranslation();

    return (
        <div className="flex items-center gap-1.5 w-full text-text-primary">
            <MdLanguage />
            <select
                className="flex-1 min-w-0 p-1 border-none text-text-primary text-[0.85rem] bg-transparent cursor-pointer font-[inherit]"
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
            >
                {locales.map((loc) => (
                    <option key={loc} value={loc}>
                        {localeLabels[loc]}
                    </option>
                ))}
            </select>
        </div>
    );
};
