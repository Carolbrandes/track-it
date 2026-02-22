import { styled } from 'styled-components';

interface ToastProps {
    type: 'success' | 'error' | 'info'
}

export const ToastContainer = styled.div<ToastProps>`
   color: ${({ theme }) => theme.colors.textSecondary};
    background-color: ${({ theme, type }) => type == 'success' ? theme.colors.success : type == 'error' ? theme.colors.danger : theme.colors.terciary};
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.success};
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    width: fit-content;
`;
