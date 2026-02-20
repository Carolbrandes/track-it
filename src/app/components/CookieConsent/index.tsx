'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import * as S from './styles';

const STORAGE_KEY = 'trackit-cookie-consent';

export function CookieConsent() {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = globalThis.window?.localStorage.getItem(STORAGE_KEY);
        if (!consent) {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        globalThis.window?.localStorage.setItem(STORAGE_KEY, 'accepted');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <S.Banner role="dialog" aria-label={t.cookieConsent.title}>
            <S.Content>
                <S.Text>
                    {t.cookieConsent.message}{' '}
                    <S.PrivacyLink href="/terms">
                        {t.cookieConsent.learnMore}
                    </S.PrivacyLink>
                </S.Text>
                <S.Actions>
                    <S.AcceptButton onClick={handleAccept}>
                        {t.cookieConsent.accept}
                    </S.AcceptButton>
                </S.Actions>
            </S.Content>
        </S.Banner>
    );
}
