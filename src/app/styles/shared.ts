import { NumericFormat } from 'react-number-format';
import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 1rem;
  width: 100%;
  min-width: 0;
  overflow-x: hidden;
  flex: 1;

  @media (min-width: 768px) {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Section = styled.section`
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const LoadingIndicator = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.danger};
`;

export const Button = styled.button<{
  $primary?: boolean;
  $danger?: boolean;
  $disabled?: boolean;
}>`
  padding: 0.6rem 1.25rem;
  background-color: ${({ $primary, $danger, theme }) =>
    $danger ? theme.colors.danger :
      $primary ? theme.colors.primary :
        theme.colors.gray300};
  color: ${({ $primary, $danger }) =>
    $danger || $primary ? '#fff' : 'inherit'};
  border: none;
  border-radius: 8px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.7 : 1)};
  transition: all 0.2s ease;
  width: fit-content;
  font-weight: 500;

  &:hover {
    opacity: 0.85;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Input = styled.input`
  padding: 0.6rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 8px;
  font-size: 0.95rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}22;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
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
  transition: all 0.2s ease;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};

  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.gray300};
  }
`;

export const StyledNumericFormat = styled(NumericFormat)`
  width: 100%;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}22;
  }
`;
