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
import * as S from '../styles';

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

    return (
        <div>
            <S.ComparisonFilterRow>
                <S.ComparisonFilterGroup>
                    <S.ComparisonFilterLabel>{t.analytics.comparisonMonthA}</S.ComparisonFilterLabel>
                    <S.ComparisonSelectGroup>
                        <S.FilterSelect
                            value={monthA}
                            onChange={e => setMonthA(Number.parseInt(e.target.value))}
                        >
                            {months.map(m => (
                                <option key={m.value} value={m.value}>{m.name}</option>
                            ))}
                        </S.FilterSelect>
                        <S.FilterSelect
                            value={yearA}
                            onChange={e => setYearA(Number.parseInt(e.target.value))}
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </S.FilterSelect>
                    </S.ComparisonSelectGroup>
                </S.ComparisonFilterGroup>

                <S.ComparisonFilterGroup>
                    <S.ComparisonFilterLabel>{t.analytics.comparisonMonthB}</S.ComparisonFilterLabel>
                    <S.ComparisonSelectGroup>
                        <S.FilterSelect
                            value={monthB}
                            onChange={e => setMonthB(Number.parseInt(e.target.value))}
                        >
                            {months.map(m => (
                                <option key={m.value} value={m.value}>{m.name}</option>
                            ))}
                        </S.FilterSelect>
                        <S.FilterSelect
                            value={yearB}
                            onChange={e => setYearB(Number.parseInt(e.target.value))}
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </S.FilterSelect>
                    </S.ComparisonSelectGroup>
                </S.ComparisonFilterGroup>
            </S.ComparisonFilterRow>

            {isEmpty ? (
                <S.EmptyState>{t.analytics.noDataForPeriod}</S.EmptyState>
            ) : (
                <>
                    <S.ChartCard style={{ marginBottom: '1.5rem' }}>
                        <S.ChartCardTitle>{t.analytics.comparisonTitle}</S.ChartCardTitle>
                        <S.BarContainer style={{ height: `${Math.max(280, allCategories.length * 60)}px` }}>
                            <Bar data={barData} options={barOptions} />
                        </S.BarContainer>
                    </S.ChartCard>

                    <S.ChartCard>
                        <S.ChartCardTitle>{t.analytics.comparisonTitle}</S.ChartCardTitle>
                        <div style={{ overflowX: 'auto' }}>
                            <S.ComparisonTable>
                                <S.ComparisonThead>
                                    <tr>
                                        <th>{t.analytics.comparisonTableCategory}</th>
                                        <th>{labelA}</th>
                                        <th>{labelB}</th>
                                        <th>{t.analytics.comparisonTableVariation}</th>
                                    </tr>
                                </S.ComparisonThead>
                                <S.ComparisonTbody>
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
                                                    <S.VariationBadge $direction={direction}>
                                                        {directionIcon}{' '}{Math.abs(diff).toFixed(1)}%
                                                    </S.VariationBadge>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </S.ComparisonTbody>
                            </S.ComparisonTable>
                        </div>
                    </S.ChartCard>
                </>
            )}
        </div>
    );
}
