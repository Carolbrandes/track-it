'use client'

import * as S from './styles';

interface SpinnerProps {
    fullPage?: boolean;
}

export const Spinner = ({ fullPage = false }: SpinnerProps) => {
    if (fullPage) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <S.Spinner />
            </div>
        );
    }

    return <S.Spinner />;
};
