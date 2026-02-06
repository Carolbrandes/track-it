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
  border: 2px solid rgba(255, 255, 255, 0.3); 
  border-top: 2px solid #FFFFFF;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  animation: ${spin} 0.8s linear infinite; 
`;