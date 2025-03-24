import styled, { keyframes } from 'styled-components';

// Criação da animação de rotação
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Componente de spinner
export const Spinner = styled.div`
  border: 8px solid ${({ theme }) => theme.colors.background}; /* cor de fundo */
  border-top: 8px solid ${({ theme }) => theme.colors.primary}; /* cor de destaque */
  border-radius: 50%;
  width: 1.2rem;
  height: 1.2rem;
  animation: ${spin} 1s linear infinite; /* Aplica a animação */
  margin: 0 auto;
`;