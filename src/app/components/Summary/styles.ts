import styled from "styled-components";

export const SummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};

  @media (min-width: 1200px) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const SummaryItem = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
`;

export const AmountPositive = styled.span`
  color: ${({ theme }) => theme.colors.success};
  font-weight: bold;
`;

export const AmountNegative = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-weight: bold;
`;

export const AmountBalance = styled.span<{ $positive: boolean }>`
  color: ${({ theme, $positive }) =>
    $positive ? theme.colors.success : theme.colors.danger};
  font-weight: bold;
`;
