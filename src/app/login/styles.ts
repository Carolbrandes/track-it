import Link from 'next/link';
import styled from 'styled-components';

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
`;

export const LoginHeader = styled.header`
   display: flex;
   flex-direction: column;
   align-items: center;
   color: ${({ theme }) => theme.colors.primary};

   h1 {
    margin-top: 0.5rem;
   }
`;

export const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  border-radius: 16px;
  background-color: ${(props) => props.theme.colors.surface};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  width: 100%;
  max-width: 400px;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.textPrimary};
  margin-bottom: 1.25rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.7rem 0.85rem;
  margin: 0.4rem 0;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.gray300};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;
  font-size: 0.95rem;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}22;
  }
`;

export const Button = styled.button`
  width: 100%;
  height: 2.75rem;
  padding: 0.65rem;
  margin-top: 0.5rem;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const TermsLink = styled(Link)`
  margin-top: 1.25rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`;
