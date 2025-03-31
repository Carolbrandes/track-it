import styled from 'styled-components';

export const PageContainer = styled.div`
  max-width: 1200px;
  padding: 2rem;
  
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 4rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const Section = styled.section`
  margin-bottom: 3rem;
  
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const LoadingIndicator = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  background-color: ${({ theme }) => theme.colors.dangerLight};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.danger};
`;


export const Button = styled.button<{
  $primary?: boolean;
  $danger?: boolean;
  $disabled?: boolean;
}>`
  padding: 0.75rem 1.5rem;
  background-color: ${({ $primary, $danger, theme }) =>
    $danger ? theme.colors.danger :
      $primary ? theme.colors.primary :
        theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.7 : 1)};
  transition: all 0.2s ease;
  width: fit-content;
  max-width: 10rem;

  &:hover {
    background-color: ${({ $primary, $danger, $disabled, theme }) =>
    $disabled ?
      ($danger ? theme.colors.danger : $primary ? theme.colors.primary : theme.colors.secondary) :
      ($danger ? theme.colors.dangerDark :
        $primary ? theme.colors.primaryDark :
          theme.colors.secondaryDark)};
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
  font-weight: bold;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

export const RadioButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.border};
  color: ${({ $active }) => ($active ? 'white' : 'inherit')};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  box-shadow: ${({ $active }) => ($active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none')};
  transform: ${({ $active }) => ($active ? 'translateY(-1px)' : 'none')};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: white;
  }

  &:active {
    transform: translateY(0);
  }
`;
