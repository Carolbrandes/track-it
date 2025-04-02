import { useRouter } from 'next/navigation';
import { CiLogout } from "react-icons/ci";

import * as S from '../../styles';

export const Logout = () => {
    const router = useRouter();

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
        <S.SettingsOption onClick={handleLogout}>
            <CiLogout />
            <span style={{ marginLeft: '10px' }}>Logout</span>
        </S.SettingsOption>
    );
};