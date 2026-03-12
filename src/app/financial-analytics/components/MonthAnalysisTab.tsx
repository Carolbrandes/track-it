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
import { cn } from '@/app/lib/cn';

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
            <div className="flex border border-gray-300 rounded-lg overflow-hidden w-fit mb-6">
                <button
                    onClick={() => setShowFixedOnly(false)}
                    className={cn(
                        'px-4 py-2 text-sm border-none cursor-pointer transition-colors duration-150 not-last:border-r not-last:border-gray-300',
                        !showFixedOnly
                            ? 'font-semibold bg-primary text-white'
                            : 'font-normal bg-surface text-text-primary hover:bg-gray-200'
                    )}
                >
                    {t.analytics.toggleGeneral}
                </button>
                <button
                    onClick={() => setShowFixedOnly(true)}
                    className={cn(
                        'px-4 py-2 text-sm border-none cursor-pointer transition-colors duration-150',
                        showFixedOnly
                            ? 'font-semibold bg-primary text-white'
                            : 'font-normal bg-surface text-text-primary hover:bg-gray-200'
                    )}
                >
                    {t.analytics.toggleFixed}
                </button>
            </div>

            {isEmpty ? (
                <div className="text-center py-10 px-4 text-text-secondary text-[0.9rem]">
                    {showFixedOnly ? t.analytics.noFixedTransactions : t.analytics.noTransactions} {monthLabel}
                </div>
            ) : (
                <>
                    {incomeByCategory.length > 0 && (
                        <div className="bg-surface border border-gray-300 rounded-xl p-5 mb-6">
                            <h3 className="text-[0.95rem] font-semibold text-text-primary m-0 mb-4">{t.analytics.income}</h3>
                            <div className="flex flex-col items-center gap-3 flex-1">
                                <div className="w-[180px] h-[180px] relative">
                                    <Pie data={buildPieData(incomeByCategory, incomeTotal)} options={pieOptions} />
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    {incomeByCategory.map(([name, amount], i) => (
                                        <div key={name} className="flex items-center gap-1.5 text-[0.8rem] text-text-primary">
                                            <div
                                                className="w-2.5 h-2.5 min-w-[10px] rounded-sm"
                                                style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                            />
                                            {name}
                                            <span className="ml-auto font-medium text-text-secondary text-[0.78rem]">
                                                {incomeTotal > 0 ? Math.round((amount / incomeTotal) * 100) : 0}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {expenseByCategory.length > 0 && (
                        <div className="bg-surface border border-gray-300 rounded-xl p-5">
                            <h3 className="text-[0.95rem] font-semibold text-text-primary m-0 mb-4">{t.analytics.expensesByCategory}</h3>
                            <div
                                className="w-full relative sm:h-[300px]"
                                style={{ height: `${Math.max(200, expenseByCategory.length * 40)}px` }}
                            >
                                <Bar data={barData} options={barOptions} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
