'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';

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
        <div
            role="dialog"
            aria-label={t.cookieConsent.title}
            className="fixed bottom-0 left-0 right-0 z-[9999] bg-surface border-t border-gray-300 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-6 py-5 animate-[slideUp_0.4s_ease-out] md:px-8"
        >
            <div className="max-w-[1000px] mx-auto flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <p className="text-sm leading-relaxed text-text-secondary m-0 flex-1">
                    {t.cookieConsent.message}{' '}
                    <a
                        href="/terms"
                        className="text-primary no-underline font-medium hover:underline"
                    >
                        {t.cookieConsent.learnMore}
                    </a>
                </p>
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={handleAccept}
                        className="py-[0.55rem] px-6 bg-primary text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-opacity duration-200 whitespace-nowrap hover:opacity-90"
                    >
                        {t.cookieConsent.accept}
                    </button>
                </div>
            </div>
        </div>
    );
}
