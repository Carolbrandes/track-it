import { useRouter } from 'next/navigation';
import { FaSignOutAlt } from 'react-icons/fa';
import * as S from '../../styles';

export const Logout = () => {
    const router = useRouter();

    const handleLogout = async () => {
        // Fazer a requisição para a API de logout no servidor
        const response = await fetch('/api/logout', {
            method: 'POST',
        });

        if (response.ok) {
            // Redirecionar para a página de login após o logout
            router.push('/login');
        } else {
            // Lidar com erro se necessário
            console.error('Erro ao tentar fazer logout');
        }
    };

    return (
        <S.SettingsOption onClick={handleLogout}>
            <FaSignOutAlt size={20} />
            <span style={{ marginLeft: '10px' }}>Logout</span>
        </S.SettingsOption>
    );
};