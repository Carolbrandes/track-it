'use client';

import { Transaction, useTransactions } from '../../hooks/useTransactions';
import { useUserData } from '../../hooks/useUserData';
import { useCurrency } from '../../hooks/useCurrency';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatCurrency } from '../../utils/formatters';
import * as S from '../styles';

interface AnalyticsSummaryProps {
    month: number;
    year: number;
    category?: string;
}

function computeSummary(transactions: Transaction[]) {
    const nonFixed = transactions.filter(t => !t.is_fixed);
    const fixed = transactions.filter(t => t.is_fixed);

    const incomeNonFixed = nonFixed.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const incomeFixed = fixed.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const incomeTotal = incomeNonFixed + incomeFixed;

    const expenseNonFixed = nonFixed.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const expenseFixed = fixed.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const expenseTotal = expenseNonFixed + expenseFixed;

    const balanceNonFixed = incomeNonFixed - expenseNonFixed;
    const balanceFixed = incomeFixed - expenseFixed;
    const balanceTotal = incomeTotal - expenseTotal;

    return {
        incomeNonFixed,
        incomeFixed,
        incomeTotal,
        expenseNonFixed,
        expenseFixed,
        expenseTotal,
        balanceNonFixed,
        balanceFixed,
        balanceTotal,
    };
}

export default function AnalyticsSummary({ month, year, category }: AnalyticsSummaryProps) {
    const { t, locale } = useTranslation();
    const { data: userData } = useUserData();
    const userId = userData?._id;
    const { selectedCurrencyCode } = useCurrency();

    const pad = (n: number) => String(n).padStart(2, '0');
    const lastDay = new Date(year, month, 0).getDate();
    const filters: { startDate: string; endDate: string; category?: string } = {
        startDate: `${year}-${pad(month)}-01`,
        endDate: `${year}-${pad(month)}-${pad(lastDay)}`,
    };
    if (category) filters.category = category;

    const { transactions = [], isLoading } = useTransactions(userId, 1, 9999, filters) || {};
    const summary = computeSummary(transactions);

    if (isLoading) {
        return <S.LoadingWrapper>{t.common.loading}</S.LoadingWrapper>;
    }

    return (
        <S.ChartCard>
            <S.ChartCardTitle>{t.analytics.summaryTitle}</S.ChartCardTitle>
            <S.SummaryGrid>
                <S.SummaryRow>
                    <S.SummaryLabel>{t.analytics.income}</S.SummaryLabel>
                    <S.SummaryValue $positive>{formatCurrency(summary.incomeNonFixed, selectedCurrencyCode, locale)}</S.SummaryValue>
                </S.SummaryRow>
                <S.SummaryRow>
                    <S.SummaryLabel>{t.analytics.incomeFixed}</S.SummaryLabel>
                    <S.SummaryValue $positive>{formatCurrency(summary.incomeFixed, selectedCurrencyCode, locale)}</S.SummaryValue>
                </S.SummaryRow>
                <S.SummaryRow $bold>
                    <S.SummaryLabel>{t.analytics.totalIncome}</S.SummaryLabel>
                    <S.SummaryValue $positive>{formatCurrency(summary.incomeTotal, selectedCurrencyCode, locale)}</S.SummaryValue>
                </S.SummaryRow>

                <S.SummaryRow>
                    <S.SummaryLabel>{t.analytics.expenses}</S.SummaryLabel>
                    <S.SummaryValue $positive={false}>{formatCurrency(summary.expenseNonFixed, selectedCurrencyCode, locale)}</S.SummaryValue>
                </S.SummaryRow>
                <S.SummaryRow>
                    <S.SummaryLabel>{t.analytics.expensesFixed}</S.SummaryLabel>
                    <S.SummaryValue $positive={false}>{formatCurrency(summary.expenseFixed, selectedCurrencyCode, locale)}</S.SummaryValue>
                </S.SummaryRow>
                <S.SummaryRow $bold>
                    <S.SummaryLabel>{t.analytics.totalExpenses}</S.SummaryLabel>
                    <S.SummaryValue $positive={false}>{formatCurrency(summary.expenseTotal, selectedCurrencyCode, locale)}</S.SummaryValue>
                </S.SummaryRow>

                <S.SummaryRow>
                    <S.SummaryLabel>{t.analytics.balance}</S.SummaryLabel>
                    <S.SummaryValue $positive={summary.balanceNonFixed >= 0}>{formatCurrency(summary.balanceNonFixed, selectedCurrencyCode, locale)}</S.SummaryValue>
                </S.SummaryRow>
                <S.SummaryRow>
                    <S.SummaryLabel>{t.analytics.balanceFixed}</S.SummaryLabel>
                    <S.SummaryValue $positive={summary.balanceFixed >= 0}>{formatCurrency(summary.balanceFixed, selectedCurrencyCode, locale)}</S.SummaryValue>
                </S.SummaryRow>
                <S.SummaryRow $bold>
                    <S.SummaryLabel>{t.analytics.balanceTotal}</S.SummaryLabel>
                    <S.SummaryValue $positive={summary.balanceTotal >= 0}>{formatCurrency(summary.balanceTotal, selectedCurrencyCode, locale)}</S.SummaryValue>
                </S.SummaryRow>
            </S.SummaryGrid>
        </S.ChartCard>
    );
}
