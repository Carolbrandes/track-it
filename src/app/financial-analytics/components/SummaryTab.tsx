'use client';

import { useCurrency } from '../../hooks/useCurrency';
import { useTransactions } from '../../hooks/useTransactions';
import { useUserData } from '../../hooks/useUserData';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatCurrency } from '../../utils/formatters';
import * as S from '../styles';
import AiInsightsSection from './AiInsightsSection';

interface SummaryTabProps {
    readonly month: number;
    readonly year: number;
    readonly category?: string;
}

export default function SummaryTab({ month, year, category }: SummaryTabProps) {
    const { t, locale } = useTranslation();
    const { data: userData } = useUserData();
    const userId = userData?._id;
    const { selectedCurrencyCode } = useCurrency();

    const pad = (n: number) => String(n).padStart(2, '0');
    const lastDay = new Date(year, month, 0).getDate();
    const filters = {
        startDate: `${year}-${pad(month)}-01`,
        endDate: `${year}-${pad(month)}-${pad(lastDay)}`,
        ...(category && { category }),
    };

    const { transactions = [], isLoading } = useTransactions(userId, 1, 9999, filters) || {};

    const incomeTotal = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenseTotal = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = incomeTotal - expenseTotal;

    const rawPercent = incomeTotal > 0 ? (expenseTotal / incomeTotal) * 100 : 0;
    let budgetStatus: 'ok' | 'warning' | 'danger' = 'ok';
    if (expenseTotal > incomeTotal) budgetStatus = 'danger';
    else if (rawPercent >= 80) budgetStatus = 'warning';

    if (isLoading) {
        return <S.LoadingWrapper>{t.common.loading}</S.LoadingWrapper>;
    }

    return (
        <div>
            <AiInsightsSection />

            <S.SummaryMetricRow style={{ marginTop: '2rem' }}>
                <S.MetricCard $type="income">
                    <S.MetricLabel>{t.analytics.totalIncomeLabel}</S.MetricLabel>
                    <S.MetricValue $type="income">
                        {formatCurrency(incomeTotal, selectedCurrencyCode, locale)}
                    </S.MetricValue>
                </S.MetricCard>

                <S.MetricCard $type="expense">
                    <S.MetricLabel>{t.analytics.totalExpensesLabel}</S.MetricLabel>
                    <S.MetricValue $type="expense">
                        {formatCurrency(expenseTotal, selectedCurrencyCode, locale)}
                    </S.MetricValue>
                </S.MetricCard>

                <S.MetricCard $type={balance >= 0 ? 'balance-pos' : 'balance-neg'}>
                    <S.MetricLabel>{t.analytics.balanceLabel}</S.MetricLabel>
                    <S.MetricValue $type={balance >= 0 ? 'balance-pos' : 'balance-neg'}>
                        {formatCurrency(balance, selectedCurrencyCode, locale)}
                    </S.MetricValue>
                </S.MetricCard>
            </S.SummaryMetricRow>

            <S.BudgetCard>
                <S.ChartCardTitle>{t.analytics.budgetProgressTitle}</S.ChartCardTitle>
                <S.BudgetTrack>
                    <S.BudgetBarFill $percent={rawPercent} $status={budgetStatus} />
                </S.BudgetTrack>
                <S.BudgetMeta>
                    <span>{t.analytics.budgetProgressOf}</span>
                    <S.BudgetPercent $status={budgetStatus}>
                        {Math.round(rawPercent)}%
                    </S.BudgetPercent>
                </S.BudgetMeta>
            </S.BudgetCard>
        </div>
    );
}
