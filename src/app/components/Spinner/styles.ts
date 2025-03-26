import styled, { keyframes } from 'styled-components';


const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;


export const Spinner = styled.div`
  border: 8px solid ${({ theme }) => theme.colors.primary}; 
  border-top: 8px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 0.85rem;
  height: 0.85rem;
  animation: ${spin} 1s linear infinite; 
  margin: 0 auto;
`;