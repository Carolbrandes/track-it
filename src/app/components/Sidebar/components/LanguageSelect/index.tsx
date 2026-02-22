'use client';

import { MdLanguage } from 'react-icons/md';
import { Locale, localeLabels, useTranslation } from '../../../../i18n/LanguageContext';
import * as S from './styles';

const locales: Locale[] = ['en', 'pt', 'es'];

export const LanguageSelect = () => {
    const { locale, setLocale } = useTranslation();

    return (
        <S.LanguageSelectContainer>
            <MdLanguage />
            <S.Select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
            >
                {locales.map((loc) => (
                    <option key={loc} value={loc}>
                        {localeLabels[loc]}
                    </option>
                ))}
            </S.Select>
        </S.LanguageSelectContainer>
    );
};
