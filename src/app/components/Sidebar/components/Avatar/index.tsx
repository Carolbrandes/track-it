'use client'

import { useUserData } from '../../../../hooks/useUserData';
import { useTranslation } from '../../../../i18n/LanguageContext';

export const Avatar = () => {
    const { data, isLoading, isError } = useUserData();
    const { t } = useTranslation();

    if (isLoading) {
        return <div>{t.avatar.loading}</div>;
    }

    if (isError) {
        return <div>{t.avatar.error}</div>;
    }

    return (
        <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-[0.8rem]">
                {data?.email?.charAt(0)?.toUpperCase()}
            </div>
            <div className="ml-2 text-[0.85rem] text-text-secondary max-[480px]:hidden">
                {data?.email?.match(/^([^@]{1,14})[^@]*@/)?.[1]}
            </div>
        </div>
    );
};
