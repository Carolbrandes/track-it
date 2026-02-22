import styled from "styled-components";

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0.85rem;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.textPrimary};
  border: 1px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.gray300};
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.gray200};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
