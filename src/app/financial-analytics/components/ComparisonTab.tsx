'use client';

import {
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
import { Bar } from 'react-chartjs-2';
import { Transaction, useTransactions } from '../../hooks/useTransactions';
import { useCurrency } from '../../hooks/useCurrency';
import { useUserData } from '../../hooks/useUserData';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatCurrency } from '../../utils/formatters';
import { cn } from '@/app/lib/cn';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function getCategoryName(txn: Transaction): string {
    if (typeof txn.category === 'object' && txn.category !== null) {
        return txn.category.name;
    }
    return 'Sem categoria';
}

function groupExpensesByCategory(transactions: Transaction[]): Map<string, number> {
    const map = new Map<string, number>();
    for (const txn of transactions.filter(t => t.type === 'expense')) {
        const name = getCategoryName(txn);
        map.set(name, (map.get(name) || 0) + txn.amount);
    }
    return map;
}

const variationBadgeStyles: Record<string, string> = {
    up: 'bg-danger/[0.1] text-danger',
    down: 'bg-success/[0.1] text-success',
    neutral: 'bg-gray-300 text-text-secondary',
};

interface ComparisonTabProps {
    readonly currentMonth: number;
    readonly currentYear: number;
    readonly months: { value: number; name: string }[];
    readonly years: number[];
}

export default function ComparisonTab({ currentMonth, currentYear, months, years }: ComparisonTabProps) {
    const { t, locale } = useTranslation();
    const { data: userData } = useUserData();
    const userId = userData?._id;
    const { selectedCurrencyCode } = useCurrency();

    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const [monthA, setMonthA] = useState(prevMonth);
    const [yearA, setYearA] = useState(prevYear);
    const [monthB, setMonthB] = useState(currentMonth);
    const [yearB, setYearB] = useState(currentYear);

    const pad = (n: number) => String(n).padStart(2, '0');

    const filtersA = {
        startDate: `${yearA}-${pad(monthA)}-01`,
        endDate: `${yearA}-${pad(monthA)}-${pad(new Date(yearA, monthA, 0).getDate())}`,
    };
    const filtersB = {
        startDate: `${yearB}-${pad(monthB)}-01`,
        endDate: `${yearB}-${pad(monthB)}-${pad(new Date(yearB, monthB, 0).getDate())}`,
    };

    const { transactions: txnsA = [] } = useTransactions(userId, 1, 9999, filtersA) || {};
    const { transactions: txnsB = [] } = useTransactions(userId, 1, 9999, filtersB) || {};

    const mapA = groupExpensesByCategory(txnsA);
    const mapB = groupExpensesByCategory(txnsB);

    const allCategories = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort((a, b) => {
        const totalA = (mapA.get(a) || 0) + (mapB.get(a) || 0);
        const totalB = (mapA.get(b) || 0) + (mapB.get(b) || 0);
        return totalB - totalA;
    });

    const labelA = `${months.find(m => m.value === monthA)?.name ?? monthA}/${yearA}`;
    const labelB = `${months.find(m => m.value === monthB)?.name ?? monthB}/${yearB}`;

    const barData = {
        labels: allCategories,
        datasets: [
            {
                label: labelA,
                data: allCategories.map(cat => mapA.get(cat) ?? 0),
                backgroundColor: '#6366f1',
                borderRadius: 4,
                barPercentage: 0.7,
            },
            {
                label: labelB,
                data: allCategories.map(cat => mapB.get(cat) ?? 0),
                backgroundColor: '#f59e0b',
                borderRadius: 4,
                barPercentage: 0.7,
            },
        ],
    };

    const barOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label(ctx) {
                        return `${ctx.dataset.label}: ${(ctx.raw as number).toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } },
            },
            y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { font: { size: 11 } },
                beginAtZero: true,
            },
        },
    };

    const isEmpty = allCategories.length === 0;

    const selectClasses = "px-3 py-2 border border-gray-300 rounded-lg text-[0.9rem] bg-surface text-text-primary font-[inherit] transition-colors duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13]";

    return (
        <div>
            <div className="flex flex-wrap gap-6 mb-8 items-end">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-text-secondary">
                        {t.analytics.comparisonMonthA}
                    </label>
                    <div className="flex gap-2">
                        <select
                            value={monthA}
                            onChange={e => setMonthA(Number.parseInt(e.target.value))}
                            className={selectClasses}
                        >
                            {months.map(m => (
                                <option key={m.value} value={m.value}>{m.name}</option>
                            ))}
                        </select>
                        <select
                            value={yearA}
                            onChange={e => setYearA(Number.parseInt(e.target.value))}
                            className={selectClasses}
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-text-secondary">
                        {t.analytics.comparisonMonthB}
                    </label>
                    <div className="flex gap-2">
                        <select
                            value={monthB}
                            onChange={e => setMonthB(Number.parseInt(e.target.value))}
                            className={selectClasses}
                        >
                            {months.map(m => (
                                <option key={m.value} value={m.value}>{m.name}</option>
                            ))}
                        </select>
                        <select
                            value={yearB}
                            onChange={e => setYearB(Number.parseInt(e.target.value))}
                            className={selectClasses}
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {isEmpty ? (
                <div className="text-center py-10 px-4 text-text-secondary text-[0.9rem]">
                    {t.analytics.noDataForPeriod}
                </div>
            ) : (
                <>
                    <div className="bg-surface border border-gray-300 rounded-xl p-5 mb-6">
                        <h3 className="text-[0.95rem] font-semibold text-text-primary m-0 mb-4">{t.analytics.comparisonTitle}</h3>
                        <div
                            className="w-full relative sm:h-[300px]"
                            style={{ height: `${Math.max(280, allCategories.length * 60)}px` }}
                        >
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>

                    <div className="bg-surface border border-gray-300 rounded-xl p-5">
                        <h3 className="text-[0.95rem] font-semibold text-text-primary m-0 mb-4">{t.analytics.comparisonTitle}</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm mt-6">
                                <thead>
                                    <tr className="[&>th]:text-left [&>th]:px-3 [&>th]:py-2.5 [&>th]:text-[0.75rem] [&>th]:font-bold [&>th]:uppercase [&>th]:tracking-wider [&>th]:text-text-secondary [&>th]:border-b-2 [&>th]:border-gray-300 [&>th]:whitespace-nowrap">
                                        <th>{t.analytics.comparisonTableCategory}</th>
                                        <th>{labelA}</th>
                                        <th>{labelB}</th>
                                        <th>{t.analytics.comparisonTableVariation}</th>
                                    </tr>
                                </thead>
                                <tbody className="[&>tr:nth-child(even)]:bg-gray-200 [&>tr>td]:px-3 [&>tr>td]:py-2.5 [&>tr>td]:border-b [&>tr>td]:border-gray-300 [&>tr>td]:text-text-primary">
                                    {allCategories.map(cat => {
                                        const valA = mapA.get(cat) ?? 0;
                                        const valB = mapB.get(cat) ?? 0;
                                        let diff = 0;
                                        if (valA > 0) diff = ((valB - valA) / valA) * 100;
                                        else if (valB > 0) diff = 100;

                                        let direction: 'up' | 'down' | 'neutral' = 'neutral';
                                        if (diff > 0.5) direction = 'up';
                                        else if (diff < -0.5) direction = 'down';

                                        let directionIcon = '—';
                                        if (direction === 'up') directionIcon = '▲';
                                        else if (direction === 'down') directionIcon = '▼';

                                        return (
                                            <tr key={cat}>
                                                <td>{cat}</td>
                                                <td>{formatCurrency(valA, selectedCurrencyCode, locale)}</td>
                                                <td>{formatCurrency(valB, selectedCurrencyCode, locale)}</td>
                                                <td>
                                                    <span className={cn(
                                                        'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[0.78rem] font-bold',
                                                        variationBadgeStyles[direction]
                                                    )}>
                                                        {directionIcon}{' '}{Math.abs(diff).toFixed(1)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
