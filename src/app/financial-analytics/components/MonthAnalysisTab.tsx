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
import { useState } from 'react';
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
                label(ctx) { return ctx.label || ''; },
            },
        },
    },
};

interface MonthAnalysisTabProps {
    readonly month: number;
    readonly year: number;
    readonly category?: string;
}

export default function MonthAnalysisTab({ month, year, category }: MonthAnalysisTabProps) {
    const { t } = useTranslation();
    const [showFixedOnly, setShowFixedOnly] = useState(false);
    const { data: userData } = useUserData();
    const userId = userData?._id;

    const pad = (n: number) => String(n).padStart(2, '0');
    const lastDay = new Date(year, month, 0).getDate();
    const filters = {
        startDate: `${year}-${pad(month)}-01`,
        endDate: `${year}-${pad(month)}-${pad(lastDay)}`,
        ...(category && { category }),
    };

    const { transactions = [] } = useTransactions(userId, 1, 9999, filters) || {};

    const base = showFixedOnly ? transactions.filter(txn => Boolean(txn.is_fixed)) : transactions;
    const income = base.filter(txn => txn.type === 'income');
    const expense = base.filter(txn => txn.type === 'expense');

    const incomeByCategory = groupByCategory(income);
    const expenseByCategory = groupByCategory(expense);
    const incomeTotal = income.reduce((s, txn) => s + txn.amount, 0);
    const expenseTotal = expense.reduce((s, txn) => s + txn.amount, 0);

    const barData = {
        labels: expenseByCategory.map(([name]) => name),
        datasets: [{
            label: t.analytics.expenses,
            data: expenseByCategory.map(([, amount]) => amount),
            backgroundColor: expenseByCategory.map((_, i) => COLORS[i % COLORS.length]),
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
                        return `${value.toFixed(2)} (${pct}%)`;
                    },
                },
            },
        },
        scales: {
            x: { grid: { display: false }, ticks: { display: false } },
            y: { grid: { display: false }, ticks: { font: { size: 12 } } },
        },
    };

    const monthLabel = new Date(year, month - 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

    const isEmpty = income.length === 0 && expense.length === 0;

    return (
        <div>
            <S.ToggleGroup>
                <S.ToggleButton $active={!showFixedOnly} onClick={() => setShowFixedOnly(false)}>
                    {t.analytics.toggleGeneral}
                </S.ToggleButton>
                <S.ToggleButton $active={showFixedOnly} onClick={() => setShowFixedOnly(true)}>
                    {t.analytics.toggleFixed}
                </S.ToggleButton>
            </S.ToggleGroup>

            {isEmpty ? (
                <S.EmptyState>
                    {showFixedOnly ? t.analytics.noFixedTransactions : t.analytics.noTransactions} {monthLabel}
                </S.EmptyState>
            ) : (
                <>
                    {incomeByCategory.length > 0 && (
                        <S.ChartCard style={{ marginBottom: '1.5rem' }}>
                            <S.ChartCardTitle>{t.analytics.income}</S.ChartCardTitle>
                            <S.PieBlock>
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
                        </S.ChartCard>
                    )}

                    {expenseByCategory.length > 0 && (
                        <S.ChartCard>
                            <S.ChartCardTitle>{t.analytics.expensesByCategory}</S.ChartCardTitle>
                            <S.BarContainer style={{ height: `${Math.max(200, expenseByCategory.length * 40)}px` }}>
                                <Bar data={barData} options={barOptions} />
                            </S.BarContainer>
                        </S.ChartCard>
                    )}
                </>
            )}
        </div>
    );
}
