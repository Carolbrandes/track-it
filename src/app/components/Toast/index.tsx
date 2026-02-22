'use client'

import * as S from './styles';

interface ToastProps {
    message: string
    type: 'success' | 'error' | 'info'
}

export const Toast = ({ message, type }: ToastProps) => {
    return (
        <S.ToastContainer type={type} >
            {message}
        </S.ToastContainer>
    );
};
