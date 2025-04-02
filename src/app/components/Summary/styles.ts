import styled from "styled-components";

export const SummaryCard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 0.3rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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