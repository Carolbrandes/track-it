import styled from "styled-components";

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin: 1rem 0;
`;

export const ResponsiveTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  }

  th {
    background-color: ${({ theme }) => theme.colors.surface};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  tr:hover {
    background-color: ${({ theme }) => theme.colors.gray200};
  }

  @media (min-width: 1200px) {
    th, td {
      white-space: nowrap;
    }
    th:nth-child(1) { width: 15%; }
    th:nth-child(2) { width: 25%; }
    th:nth-child(3) { width: 20%; }
    th:nth-child(4) { width: 10%; }
    th:nth-child(5) { width: 8%; }
    th:nth-child(6) { width: 15%; }
    th:nth-child(7) { width: 15%; }
  }
`;

export const SortableTh = styled.th<{ $active: boolean }>`
  cursor: pointer;
  user-select: none;
  transition: color 0.15s;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary} !important;

  &:hover {
    color: ${({ theme }) => theme.colors.primary} !important;
  }

  & > svg {
    vertical-align: middle;
    margin-left: 4px;
  }
`;

export const SortIconInactive = styled.span`
  display: inline-block;
  width: 14px;
  margin-left: 4px;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const TypeBadge = styled.span<{ $type: 'income' | 'expense' }>`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ theme, $type }) =>
    $type === 'income' ? `${theme.colors.success}22` : `${theme.colors.danger}22`};
  color: ${({ theme, $type }) =>
    $type === 'income' ? theme.colors.success : theme.colors.danger};
`;

export const Amount = styled.span<{ $type: 'income' | 'expense' }>`
  font-weight: bold;
  color: ${({ theme, $type }) =>
    $type === 'income' ? theme.colors.success : theme.colors.danger};
`;

export const EditButton = styled.button`
  padding: 0.3rem 0.65rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

export const DeleteButton = styled.button`
  padding: 0.3rem 0.65rem;
  background-color: ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.danger};
    color: white;
  }
`;

/* ---- Mobile: cards (só visível abaixo do breakpoint) ---- */
export const MobileCardsList = styled.div`
  display: none;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0;

  @media (max-width: 859px) {
    display: flex;
  }
`;

export const MobileCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

export const MobileCardHeader = styled.div`
  padding: 1rem;
`;

export const MobileCardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

export const MobileCardDescription = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  flex: 1;
  min-width: 0;
  word-break: break-word;
`;

export const MobileCardAmount = styled.span<{ $type: 'income' | 'expense' }>`
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
  color: ${({ theme, $type }) =>
    $type === 'income' ? theme.colors.success : theme.colors.danger};
`;

export const MobileCardDate = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

export const MobileCardVerMais = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  margin-top: 0.25rem;

  &:hover {
    text-decoration: underline;
  }
`;

export const MobileCardExpanded = styled.div`
  padding: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray300};
`;

export const MobileCardDetailRow = styled.div`
  margin-top: 0.75rem;

  &:first-child {
    margin-top: 0;
  }
`;

export const MobileCardDetailLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.15rem;
`;

export const MobileCardDetailValue = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const MobileCardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const MobileCardEditBtn = styled.button`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

export const MobileCardDeleteBtn = styled.button`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

/* Container da tabela: esconder no mobile */
export const TableWrapper = styled.div`
  @media (max-width: 859px) {
    display: none;
  }
`;
