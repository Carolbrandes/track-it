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
import { cn } from '@/app/lib/cn';
import { Transaction, useTransactions } from '../../hooks/useTransactions';
import { useUserData } from '../../hooks/useUserData';
import { useTranslation } from '../../i18n/LanguageContext';

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

const FinancialPieChart = ({ month, year, category }: { month: number; year: number; category?: string }) => {
    const { t } = useTranslation();
    const { data: userData } = useUserData();
    const userId = userData?._id;
    const pad = (n: number) => String(n).padStart(2, '0');
    const lastDay = new Date(year, month, 0).getDate();
    const filters: { startDate: string; endDate: string; category?: string } = {
        startDate: `${year}-${pad(month)}-01`,
        endDate: `${year}-${pad(month)}-${pad(lastDay)}`,
    };
    if (category) filters.category = category;
    const { transactions = [] } = useTransactions(userId, 1, 9999, filters) || {};

    const filtered = transactions;

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
        return <div className="text-center py-10 px-4 text-text-secondary text-sm">{t.analytics.noTransactions} {monthLabel}</div>;
    }

    return (
        <>
            <div className="bg-surface border border-gray-300 rounded-xl p-5">
                <div className="flex flex-col gap-6 min-[600px]:flex-row">
                    {incomeByCategory.length > 0 && (
                        <div className="flex flex-col items-center gap-3 flex-1">
                            <div className="text-sm font-semibold text-text-secondary uppercase tracking-wide">{t.analytics.income}</div>
                            <div className="w-[180px] h-[180px] relative">
                                <Pie data={buildPieData(incomeByCategory, incomeTotal)} options={pieOptions} />
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                {incomeByCategory.map(([name, amount], i) => (
                                    <div key={name} className="flex items-center gap-1.5 text-xs text-text-primary">
                                        <div className="w-2.5 h-2.5 min-w-[10px] rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        {name}
                                        <span className="ml-auto font-medium text-text-secondary text-[0.78rem]">
                                            {incomeTotal > 0 ? Math.round((amount / incomeTotal) * 100) : 0}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {expenseByCategory.length > 0 && (
                        <div className="flex flex-col items-center gap-3 flex-1">
                            <div className="text-sm font-semibold text-text-secondary uppercase tracking-wide">{t.analytics.expenses}</div>
                            <div className="w-[180px] h-[180px] relative">
                                <Pie data={buildPieData(expenseByCategory, expenseTotal)} options={pieOptions} />
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                {expenseByCategory.map(([name, amount], i) => (
                                    <div key={name} className="flex items-center gap-1.5 text-xs text-text-primary">
                                        <div className="w-2.5 h-2.5 min-w-[10px] rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        {name}
                                        <span className="ml-auto font-medium text-text-secondary text-[0.78rem]">
                                            {expenseTotal > 0 ? Math.round((amount / expenseTotal) * 100) : 0}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 mt-2">
                    <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-success/[0.09] text-success")}>
                        {t.analytics.income}: ${incomeTotal.toFixed(2)}
                    </div>
                    <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-danger/[0.09] text-danger")}>
                        {t.analytics.expenses}: ${expenseTotal.toFixed(2)}
                    </div>
                </div>
            </div>

            {allExpenseCategories.length > 0 && (
                <div className="bg-surface border border-gray-300 rounded-xl p-5">
                    <h3 className="text-[0.95rem] font-semibold text-text-primary mt-0 mb-4">{t.analytics.expensesByCategory}</h3>
                    <div className="w-full h-[260px] relative min-[600px]:h-[300px]">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>
            )}
        </>
    );
};

export default FinancialPieChart;
