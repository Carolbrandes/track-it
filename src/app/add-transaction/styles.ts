import { NumericFormat } from 'react-number-format';
import styled from 'styled-components';
export * from '../categories/styles';

export const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  background-color: ${({ theme }) => theme.colors.surface};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray200};
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
    $active ? theme.colors.primary : theme.colors.gray200};
  color: ${({ $active, theme }) =>
    $active ? '#fff' : theme.colors.textSecondary};
  border: 1px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.gray300};
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.gray300};
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
  padding: 0.6rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;
`;

export const StyledNumericFormat = styled(NumericFormat)`
  width: 100%;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;
`;
