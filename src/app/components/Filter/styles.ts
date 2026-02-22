import { NumericFormat } from "react-number-format";
import styled from "styled-components";

export const FilterContainer = styled.div`
  .filterButtonContainer {
    display: flex;
    justify-content: end;
    gap: 1rem;
    margin-bottom: 2rem;

    button {
      background: transparent;
      border: 1px solid ${({ theme }) => theme.colors.primary};
      height: 2rem;
      width: 2rem;
      border-radius: 8px;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const FilterForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 900px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    align-items: start;
  }
`;

export const FilterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FilterBottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (min-width: 900px) {
    grid-column: 1 / -1;
  }
`;

export const FilterInput = styled.input`
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}22;
  }
`;

export const FilterSelect = styled.select`
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}22;
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.textPrimary};

  input {
    width: 1.1rem;
    height: 1.1rem;
    cursor: pointer;
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ResetButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  white-space: nowrap;
  font-family: inherit;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const filterFieldCss = `
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 100%;
  font-family: inherit;
  transition: border-color 0.2s;
`;

export const FilterNumericFormat = styled(NumericFormat)`
  ${filterFieldCss}
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}22;
  }
`;

export const DateFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const DateLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const FilterDateInput = styled.input`
  ${filterFieldCss}
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}22;
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;
