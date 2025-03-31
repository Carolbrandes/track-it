import styled from 'styled-components';
import * as CommonStyles from './styles/shared';

export const PageContainer = CommonStyles.PageContainer;
export const Title = CommonStyles.Title;
export const Section = CommonStyles.Section;
export const SectionTitle = CommonStyles.SectionTitle;
export const LoadingIndicator = CommonStyles.LoadingIndicator;
export const ErrorMessage = CommonStyles.ErrorMessage;

export const FilterForm = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  width: 100%;
`;

export const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  width: 100%;
`;

export const SummaryCard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.background};
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

export const ResponsiveTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    background-color: ${({ theme }) => theme.colors.background};
    font-weight: bold;
  }

  tr:hover {
    background-color: ${({ theme }) => theme.colors.hover};
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
    $type === 'income' ? theme.colors.successLight : theme.colors.danger};
  color: ${({ theme }) => theme.colors.background};
`;

export const Amount = styled.span<{ $type: 'income' | 'expense' }>`
  font-weight: bold;
  color: ${({ theme, $type }) =>
    $type === 'income' ? theme.colors.success : theme.colors.danger};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const EditButton = styled.button`
  padding: 0.25rem 0.5rem;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryDark};
  }
`;

export const DeleteButton = styled.button`
  padding: 0.25rem 0.5rem;
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dangerDark};
  }
`;

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
    $active ? 'white' : theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primaryDark : theme.colors.hover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
export const ResetButton = styled.button`
  background-color: #f0f0f0; 
  color: #007bff; 
  border: 1px solid #007bff;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;

 
  &:hover {
    background-color: #007bff; 
    color: #fff;
    border-color: #0056b3; 
  }

 
  &:disabled {
    background-color: #e0e0e0;
    color: #b0b0b0;
    border-color: #b0b0b0;
    cursor: not-allowed;
  }
`;