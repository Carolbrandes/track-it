'use client'

import { useRouter } from 'next/navigation';
import { CiLogout } from "react-icons/ci";
import { useTranslation } from '../../../../i18n/LanguageContext';

export const Logout = () => {
    const router = useRouter();
    const { t } = useTranslation();

    const handleLogout = async () => {

        const response = await fetch('/api/logout', {
            method: 'POST',
        });

        if (response.ok) {
            router.push('/login');
        } else {
            console.error('Erro ao tentar fazer logout');
        }
    };

    return (
        <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[0.9rem] text-text-primary cursor-pointer transition-[background] duration-150 hover:bg-gray-200 bg-transparent border-none w-full font-[inherit]"
            onClick={handleLogout}
        >
            <CiLogout />
            <span className="ml-2.5">{t.sidebar.logout}</span>
        </button>
    );
};
