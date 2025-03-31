// app/transactions/styles.ts
import styled from 'styled-components';

// Re-export all existing styles from your categories page
export * from '../categories/styles';

// Add new transaction-specific styles
export const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

export const TransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-grow: 1;
`;

export const TransactionDescription = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

export const TransactionMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const TransactionAmount = styled.span<{ $type: 'income' | 'expense' }>`
  font-weight: bold;
  color: ${({ theme, $type }) =>
    $type === 'income' ? theme.colors.success : theme.colors.danger};
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const RadioButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primaryDark : theme.colors.secondaryDark};
  }
`;

export const CurrencyInputContainer = styled.div`
  position: relative;

  &::before {
    content: '$';
    position: absolute;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  input {
    padding-left: 1.5rem;
  }
`;

export const DatePickerWrapper = styled.div`
  input {
    width: 100%;
  }
`;

export const CategorySelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

// Add to your theme if needed (in your global styles)
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryDark: string;
      secondary: string;
      secondaryDark: string;
      danger: string;
      dangerDark: string;
      success: string;
      successDark: string;
      text: string;
      textSecondary: string;
      background: string;
      hover: string;
      border: string;
    };
  }
}

export const SuccessMessage = styled.div`
    color: ${({ theme }) => theme.colors.background};
    background-color: ${({ theme }) => theme.colors.successLight};
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.success};
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    width: fit-content;
`;