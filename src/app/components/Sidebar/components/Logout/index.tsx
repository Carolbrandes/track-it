'use client'

import { useRouter } from 'next/navigation';
import { CiLogout } from "react-icons/ci";
import { useTranslation } from '../../../../i18n/LanguageContext';

import * as S from '../../styles';

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
        <S.DropdownItem onClick={handleLogout}>
            <CiLogout />
            <span style={{ marginLeft: '10px' }}>{t.sidebar.logout}</span>
        </S.DropdownItem>
    );
};