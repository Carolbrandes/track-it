import styled from 'styled-components';
import * as CommonStyles from '../styles/shared';

export const PageContainer = CommonStyles.PageContainer

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Section = styled.section`
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: underline;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 6rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: bold;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

export const Button = styled.button<{ $small?: boolean; $secondary?: boolean; $danger?: boolean }>`
  padding: ${({ $small }) => ($small ? '0.5rem 1rem' : '0.75rem 1.5rem')};
  background-color: ${({ $secondary, $danger, theme }) =>
    $danger ? theme.colors.danger :
      $secondary ? theme.colors.secondary :
        theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: ${({ $small }) => ($small ? '0.875rem' : '1rem')};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $secondary, $danger, theme }) =>
    $danger ? theme.colors.danger :
      $secondary ? theme.colors.gray700 :
        theme.colors.primaryDark};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ListContainer = styled.div`
  margin-top: 1rem;
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
  padding: 1rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

export const ListItemText = styled.span`
  flex-grow: 1;
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
  background-color: #ffebee;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export const LoadingIndicator = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
`;