'use client';

import styled, { keyframes } from 'styled-components';
import * as CommonStyles from '../styles/shared';

export const PageContainer = CommonStyles.PageContainer;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1.25rem;
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 400px;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
`;

export const FilterLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const FilterSelect = styled.select`
  padding: 0.55rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}22;
  }
`;

// ─── Layout principal ───

export const AnalyticsLayout = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 2rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

export const ChartsColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ChartSectionTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

// ─── Cards de gráfico ───

export const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 12px;
  padding: 1.25rem;
`;

export const ChartCardTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 1rem;
`;

export const PieRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 600px) {
    flex-direction: row;
  }
`;

export const PieBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

export const PieLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const PieContainer = styled.div`
  width: 180px;
  height: 180px;
  position: relative;
`;

export const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 100%;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ColorBox = styled.div`
  width: 10px;
  height: 10px;
  min-width: 10px;
  border-radius: 2px;
`;

export const LegendValue = styled.span`
  margin-left: auto;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.78rem;
`;

// ─── Gráfico de barras ───

export const BarContainer = styled.div`
  width: 100%;
  height: 260px;
  position: relative;

  @media (min-width: 600px) {
    height: 300px;
  }
`;

// ─── Totais ───

export const TotalsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

export const TotalChip = styled.div<{ $type: 'income' | 'expense' | 'balance' }>`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ $type, theme }) =>
    $type === 'income' ? `${theme.colors.success}18` :
    $type === 'expense' ? `${theme.colors.danger}18` :
    `${theme.colors.primary}18`};
  color: ${({ $type, theme }) =>
    $type === 'income' ? theme.colors.success :
    $type === 'expense' ? theme.colors.danger :
    theme.colors.primary};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2.5rem 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// ─── AI Insights ───

export const InsightsPanel = styled.div`
  width: 100%;

  @media (min-width: 1024px) {
    width: 380px;
    min-width: 380px;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    position: sticky;
    top: 5rem;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.colors.gray300};
      border-radius: 4px;
    }
  }
`;

export const InsightsPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const InsightsSectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spinning {
    animation: ${spin} 1s linear infinite;
  }
`;

export const InsightsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const InsightCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 1rem 1.15rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const InsightCardTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

export const InsightText = styled.p`
  font-size: 0.85rem;
  line-height: 1.55;
`;

export const AnomalyList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const AnomalyItem = styled.li`
  padding: 0.45rem 0.7rem;
  background-color: ${({ theme }) => theme.colors.danger}11;
  border-left: 3px solid ${({ theme }) => theme.colors.danger};
  border-radius: 0 8px 8px 0;
  font-size: 0.82rem;
  line-height: 1.45;
`;

export const CategoryTable = styled.div`
  overflow-x: auto;
`;

export const InsightTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;

  th, td {
    text-align: left;
    padding: 0.45rem 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  }

  th {
    font-weight: 600;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const PercentBadge = styled.span<{ $isPositive: boolean }>`
  display: inline-block;
  padding: 0.1rem 0.35rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ $isPositive, theme }) =>
    $isPositive ? `${theme.colors.success}22` : `${theme.colors.danger}22`};
  color: ${({ $isPositive, theme }) =>
    $isPositive ? theme.colors.success : theme.colors.danger};
`;

// ─── Ghost Expenses ───

export const GhostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const GhostItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.6rem 0.75rem;
  background: ${({ theme }) => theme.colors.warning}0D;
  border-left: 3px solid ${({ theme }) => theme.colors.warning};
  border-radius: 0 8px 8px 0;
`;

export const GhostItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const GhostItemName = styled.span`
  font-weight: 600;
  font-size: 0.84rem;
`;

export const GhostItemAmount = styled.span`
  font-weight: 700;
  font-size: 0.84rem;
  color: ${({ theme }) => theme.colors.danger};
`;

export const GhostItemMeta = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const GhostItemSuggestion = styled.span`
  font-size: 0.8rem;
  font-style: italic;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.4;
`;

export const GhostEmptyText = styled.p`
  font-size: 0.84rem;
  color: ${({ theme }) => theme.colors.success};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

// ─── Cash Flow Forecast ───

export const ForecastGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const ForecastRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};

  &:last-child {
    border-bottom: none;
  }
`;

export const ForecastLabel = styled.span`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ForecastValue = styled.span<{ $positive?: boolean }>`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${({ $positive, theme }) =>
    $positive === undefined ? theme.colors.textPrimary :
    $positive ? theme.colors.success : theme.colors.danger};
`;

export const ForecastNote = styled.p`
  font-size: 0.82rem;
  line-height: 1.5;
  padding: 0.5rem 0.6rem;
  background: ${({ theme }) => theme.colors.primary}0D;
  border-radius: 8px;
  margin-top: 0.25rem;
`;

export const MotivationalCard = styled(InsightCard)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: #fff;
  border-color: transparent;
`;

export const MotivationalText = styled.p`
  font-size: 0.88rem;
  line-height: 1.55;
  font-weight: 500;
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

export const SkeletonCard = styled.div`
  background-color: ${({ theme }) => theme.colors.gray200};
  border-radius: 12px;
  padding: 1rem;
  height: 72px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const ErrorCard = styled(InsightCard)`
  border-left: 3px solid ${({ theme }) => theme.colors.danger};
`;

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.85rem;
`;
