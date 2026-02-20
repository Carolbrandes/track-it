'use client';

import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Transaction, useTransactions } from '../../hooks/useTransactions';
import { useUserData } from '../../hooks/useUserData';
import { useTranslation } from '../../i18n/LanguageContext';
import * as S from '../styles';

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const COLORS = [
    '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
    '#06b6d4', '#f97316', '#ec4899', '#14b8a6', '#a855f7',
    '#eab308', '#64748b', '#78716c', '#3b82f6', '#22c55e',
];

function getCategoryName(txn: Transaction): string {
    if (typeof txn.category === 'object' && txn.category !== null) {
        return txn.category.name;
    }
    return 'Sem categoria';
}

function groupByCategory(transactions: Transaction[]) {
    const map = new Map<string, number>();
    for (const txn of transactions) {
        const name = getCategoryName(txn);
        map.set(name, (map.get(name) || 0) + txn.amount);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

function buildPieData(categories: [string, number][], total: number) {
    return {
        labels: categories.map(([name, amount]) => {
            const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
            return `${name} (${pct}%)`;
        }),
        datasets: [{
            data: categories.map(([, amount]) => amount),
            backgroundColor: categories.map((_, i) => COLORS[i % COLORS.length]),
            borderWidth: 2,
            borderColor: 'transparent',
        }],
    };
}

const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label(ctx) {
                    return ctx.label || '';
                },
            },
        },
    },
};

const FinancialPieChart = ({ month, year }: { month: number; year: number }) => {
    const { t } = useTranslation();
    const { data: userData } = useUserData();
    const userId = userData?._id;
    const { transactions = [] } = useTransactions(userId, 1, 100) || {};

    const filtered = transactions.filter(txn => {
        if (!txn.date) return false;
        const d = new Date(txn.date);
        const utc = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
        return utc.getUTCMonth() + 1 === month && utc.getUTCFullYear() === year;
    });

    const income = filtered.filter(txn => txn.type === 'income');
    const expense = filtered.filter(txn => txn.type === 'expense');

    const incomeByCategory = groupByCategory(income);
    const expenseByCategory = groupByCategory(expense);

    const incomeTotal = income.reduce((s, txn) => s + txn.amount, 0);
    const expenseTotal = expense.reduce((s, txn) => s + txn.amount, 0);

    const allExpenseCategories = expenseByCategory;

    const barData = {
        labels: allExpenseCategories.map(([name]) => name),
        datasets: [{
            label: t.analytics.expenses,
            data: allExpenseCategories.map(([, amount]) => amount),
            backgroundColor: allExpenseCategories.map((_, i) => COLORS[i % COLORS.length]),
            borderRadius: 6,
            barThickness: 24,
        }],
    };

    const barOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label(ctx) {
                        const value = ctx.raw as number;
                        const pct = expenseTotal > 0 ? Math.round((value / expenseTotal) * 100) : 0;
                        return `$${value.toFixed(2)} (${pct}%)`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { display: false },
            },
            y: {
                grid: { display: false },
                ticks: {
                    font: { size: 12 },
                },
            },
        },
    };

    const monthLabel = new Date(year, month - 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

    if (filtered.length === 0) {
        return <S.EmptyState>{t.analytics.noTransactions} {monthLabel}</S.EmptyState>;
    }

    return (
        <>
            <S.ChartCard>
                <S.PieRow>
                    {incomeByCategory.length > 0 && (
                        <S.PieBlock>
                            <S.PieLabel>{t.analytics.income}</S.PieLabel>
                            <S.PieContainer>
                                <Pie data={buildPieData(incomeByCategory, incomeTotal)} options={pieOptions} />
                            </S.PieContainer>
                            <S.LegendContainer>
                                {incomeByCategory.map(([name, amount], i) => (
                                    <S.LegendItem key={name}>
                                        <S.ColorBox style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        {name}
                                        <S.LegendValue>
                                            {incomeTotal > 0 ? Math.round((amount / incomeTotal) * 100) : 0}%
                                        </S.LegendValue>
                                    </S.LegendItem>
                                ))}
                            </S.LegendContainer>
                        </S.PieBlock>
                    )}

                    {expenseByCategory.length > 0 && (
                        <S.PieBlock>
                            <S.PieLabel>{t.analytics.expenses}</S.PieLabel>
                            <S.PieContainer>
                                <Pie data={buildPieData(expenseByCategory, expenseTotal)} options={pieOptions} />
                            </S.PieContainer>
                            <S.LegendContainer>
                                {expenseByCategory.map(([name, amount], i) => (
                                    <S.LegendItem key={name}>
                                        <S.ColorBox style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        {name}
                                        <S.LegendValue>
                                            {expenseTotal > 0 ? Math.round((amount / expenseTotal) * 100) : 0}%
                                        </S.LegendValue>
                                    </S.LegendItem>
                                ))}
                            </S.LegendContainer>
                        </S.PieBlock>
                    )}
                </S.PieRow>

                <S.TotalsRow>
                    <S.TotalChip $type="income">
                        {t.analytics.income}: ${incomeTotal.toFixed(2)}
                    </S.TotalChip>
                    <S.TotalChip $type="expense">
                        {t.analytics.expenses}: ${expenseTotal.toFixed(2)}
                    </S.TotalChip>
                </S.TotalsRow>
            </S.ChartCard>

            {allExpenseCategories.length > 0 && (
                <S.ChartCard>
                    <S.ChartCardTitle>{t.analytics.expensesByCategory}</S.ChartCardTitle>
                    <S.BarContainer>
                        <Bar data={barData} options={barOptions} />
                    </S.BarContainer>
                </S.ChartCard>
            )}
        </>
    );
};

export default FinancialPieChart;
