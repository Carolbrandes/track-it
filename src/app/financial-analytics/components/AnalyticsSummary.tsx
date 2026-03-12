'use client';

import { Transaction, useTransactions } from '../../hooks/useTransactions';
import { useUserData } from '../../hooks/useUserData';
import { useCurrency } from '../../hooks/useCurrency';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatCurrency } from '../../utils/formatters';
import { cn } from '@/app/lib/cn';

interface AnalyticsSummaryProps {
    readonly month: number;
    readonly year: number;
    readonly category?: string;
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

function SummaryValueColor(positive?: boolean): string {
    if (positive === undefined) return 'text-text-primary';
    return positive ? 'text-success' : 'text-danger';
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
        return (
            <div className="flex justify-center items-center w-full h-[200px] text-text-secondary">
                {t.common.loading}
            </div>
        );
    }

    return (
        <div className="bg-surface border border-gray-300 rounded-xl p-5">
            <h3 className="text-[0.95rem] font-semibold text-text-primary m-0 mb-4">{t.analytics.summaryTitle}</h3>
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span className="text-[0.9rem] text-text-secondary">{t.analytics.income}</span>
                    <span className={cn('text-[0.95rem] font-semibold', SummaryValueColor(true))}>
                        {formatCurrency(summary.incomeNonFixed, selectedCurrencyCode, locale)}
                    </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span className="text-[0.9rem] text-text-secondary">{t.analytics.incomeFixed}</span>
                    <span className={cn('text-[0.95rem] font-semibold', SummaryValueColor(true))}>
                        {formatCurrency(summary.incomeFixed, selectedCurrencyCode, locale)}
                    </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-300 font-bold">
                    <span className="text-[0.9rem] text-text-secondary">{t.analytics.totalIncome}</span>
                    <span className={cn('text-[0.95rem] font-semibold', SummaryValueColor(true))}>
                        {formatCurrency(summary.incomeTotal, selectedCurrencyCode, locale)}
                    </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span className="text-[0.9rem] text-text-secondary">{t.analytics.expenses}</span>
                    <span className={cn('text-[0.95rem] font-semibold', SummaryValueColor(false))}>
                        {formatCurrency(summary.expenseNonFixed, selectedCurrencyCode, locale)}
                    </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span className="text-[0.9rem] text-text-secondary">{t.analytics.expensesFixed}</span>
                    <span className={cn('text-[0.95rem] font-semibold', SummaryValueColor(false))}>
                        {formatCurrency(summary.expenseFixed, selectedCurrencyCode, locale)}
                    </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-300 font-bold">
                    <span className="text-[0.9rem] text-text-secondary">{t.analytics.totalExpenses}</span>
                    <span className={cn('text-[0.95rem] font-semibold', SummaryValueColor(false))}>
                        {formatCurrency(summary.expenseTotal, selectedCurrencyCode, locale)}
                    </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span className="text-[0.9rem] text-text-secondary">{t.analytics.balance}</span>
                    <span className={cn('text-[0.95rem] font-semibold', SummaryValueColor(summary.balanceNonFixed >= 0))}>
                        {formatCurrency(summary.balanceNonFixed, selectedCurrencyCode, locale)}
                    </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span className="text-[0.9rem] text-text-secondary">{t.analytics.balanceFixed}</span>
                    <span className={cn('text-[0.95rem] font-semibold', SummaryValueColor(summary.balanceFixed >= 0))}>
                        {formatCurrency(summary.balanceFixed, selectedCurrencyCode, locale)}
                    </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b-0 font-bold">
                    <span className="text-[0.9rem] text-text-secondary">{t.analytics.balanceTotal}</span>
                    <span className={cn('text-[0.95rem] font-semibold', SummaryValueColor(summary.balanceTotal >= 0))}>
                        {formatCurrency(summary.balanceTotal, selectedCurrencyCode, locale)}
                    </span>
                </div>
            </div>
        </div>
    );
}
