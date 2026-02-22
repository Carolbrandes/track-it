import styled from 'styled-components';
import * as CommonStyles from '../styles/shared';

export const PageContainer = CommonStyles.PageContainer;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Section = styled.section`
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 12px;
  padding: 1.25rem;
`;

export const Form = styled.form`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Input = styled.input`
  padding: 0.55rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 8px;
  font-size: 0.95rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}22;
  }
`;

export const Button = styled.button<{ $small?: boolean; $secondary?: boolean; $danger?: boolean }>`
  padding: ${({ $small }) => ($small ? '0.4rem 0.75rem' : '0.55rem 1.1rem')};
  background-color: ${({ $secondary, $danger, theme }) =>
    $danger ? theme.colors.danger :
      $secondary ? theme.colors.gray300 :
        theme.colors.primary};
  color: ${({ $secondary, theme }) =>
    $secondary ? theme.colors.textPrimary : '#fff'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: ${({ $small }) => ($small ? '0.8rem' : '0.9rem')};
  font-weight: 500;
  font-family: inherit;
  transition: opacity 0.2s;
  white-space: nowrap;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray300};
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.4rem;
`;

export const ListContainer = styled.div`
  margin-top: 0;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300}66;

  &:last-child {
    border-bottom: none;
  }
`;

export const ListItemText = styled.span`
  flex-grow: 1;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.95rem;
`;

export const EditForm = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  align-items: center;

  ${Input} {
    flex-grow: 1;
  }
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  background-color: ${({ theme }) => theme.colors.danger}11;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.danger}33;
  font-size: 0.9rem;
`;

export const LoadingIndicator = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  font-size: 0.9rem;
`;
