import { NumericFormat } from 'react-number-format';
import styled from 'styled-components';
export * from '../categories/styles';


export const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  background-color: ${({ theme }) => theme.colors.background};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray300};
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
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const TransactionMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textPrimary};
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
    $active ? theme.colors.primary : theme.colors.gray700};
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
    color: ${({ theme }) => theme.colors.textPrimary};
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
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 4px;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const StyledNumericFormat = styled(NumericFormat)`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 4px;
 
`;


declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string
      textPrimary: string
      textSecondary: string
      primary: string
      secondary: string
      terciary: string
      gray200: string
      gray300: string
      gray700: string
      danger: string
      success: string
    };
  }
}

