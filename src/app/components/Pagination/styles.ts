import styled from "styled-components";

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.background};
  color: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.gray300};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;