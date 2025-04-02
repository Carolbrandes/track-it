import styled from "styled-components";

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ResponsiveTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  }

  th {
    background-color: ${({ theme }) => theme.colors.background};
    font-weight: bold;
  }

  tr:hover {
    background-color: ${({ theme }) => theme.colors.gray300};
  }

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

export const TypeBadge = styled.span<{ $type: 'income' | 'expense' }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  background-color: ${({ theme, $type }) =>
        $type === 'income' ? theme.colors.success : theme.colors.danger};
  color: ${({ theme }) => theme.colors.background};
`;

export const Amount = styled.span<{ $type: 'income' | 'expense' }>`
  font-weight: bold;
  color: ${({ theme, $type }) =>
        $type === 'income' ? theme.colors.success : theme.colors.danger};
`;



export const EditButton = styled.button`
  padding: 0.25rem 0.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray700};
  }
`;

export const DeleteButton = styled.button`
  padding: 0.25rem 0.5rem;
  background-color: ${({ theme }) => theme.colors.gray700};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.danger};
  }
`;