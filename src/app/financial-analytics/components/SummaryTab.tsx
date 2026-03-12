'use client';

import { cn } from '@/app/lib/cn';
import { useCurrency } from '../../hooks/useCurrency';
import { useTransactions } from '../../hooks/useTransactions';
import { useUserData } from '../../hooks/useUserData';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatCurrency } from '../../utils/formatters';
import AiInsightsSection from './AiInsightsSection';

interface SummaryTabProps {
    readonly month: number;
    readonly year: number;
    readonly category?: string;
}

const metricCardBorderColor: Record<string, string> = {
    income: 'border-t-success',
    expense: 'border-t-danger',
    'balance-pos': 'border-t-primary',
    'balance-neg': 'border-t-danger',
};

const metricValueColor: Record<string, string> = {
    income: 'text-success',
    expense: 'text-danger',
    'balance-pos': 'text-primary',
    'balance-neg': 'text-danger',
};

const budgetBarColor: Record<string, string> = {
    ok: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
};

const budgetPercentColor: Record<string, string> = {
    ok: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
};

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
        return (
            <div className="flex justify-center items-center w-full h-[200px] text-text-secondary">
                {t.common.loading}
            </div>
        );
    }

    const balanceType = balance >= 0 ? 'balance-pos' : 'balance-neg';

    return (
        <div>
            <AiInsightsSection />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 mt-8">
                <div className={cn(
                    'bg-surface border border-gray-300 rounded-xl px-5 py-4 flex flex-col gap-1.5 border-t-[3px]',
                    metricCardBorderColor.income
                )}>
                    <span className="text-[0.78rem] font-semibold uppercase tracking-wider text-text-secondary">
                        {t.analytics.totalIncomeLabel}
                    </span>
                    <span className={cn('text-[1.35rem] font-bold', metricValueColor.income)}>
                        {formatCurrency(incomeTotal, selectedCurrencyCode, locale)}
                    </span>
                </div>

                <div className={cn(
                    'bg-surface border border-gray-300 rounded-xl px-5 py-4 flex flex-col gap-1.5 border-t-[3px]',
                    metricCardBorderColor.expense
                )}>
                    <span className="text-[0.78rem] font-semibold uppercase tracking-wider text-text-secondary">
                        {t.analytics.totalExpensesLabel}
                    </span>
                    <span className={cn('text-[1.35rem] font-bold', metricValueColor.expense)}>
                        {formatCurrency(expenseTotal, selectedCurrencyCode, locale)}
                    </span>
                </div>

                <div className={cn(
                    'bg-surface border border-gray-300 rounded-xl px-5 py-4 flex flex-col gap-1.5 border-t-[3px]',
                    metricCardBorderColor[balanceType]
                )}>
                    <span className="text-[0.78rem] font-semibold uppercase tracking-wider text-text-secondary">
                        {t.analytics.balanceLabel}
                    </span>
                    <span className={cn('text-[1.35rem] font-bold', metricValueColor[balanceType])}>
                        {formatCurrency(balance, selectedCurrencyCode, locale)}
                    </span>
                </div>
            </div>

            <div className="bg-surface border border-gray-300 rounded-xl p-5">
                <h3 className="text-[0.95rem] font-semibold text-text-primary m-0 mb-4">
                    {t.analytics.budgetProgressTitle}
                </h3>
                <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden mt-3 mb-2">
                    <div
                        className={cn('h-full rounded-full transition-[width] duration-400 ease-out', budgetBarColor[budgetStatus])}
                        style={{ width: `${Math.min(rawPercent, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between items-center gap-2 text-[0.82rem] text-text-secondary">
                    <span>{t.analytics.budgetProgressOf}</span>
                    <span className={cn('font-bold text-[0.9rem]', budgetPercentColor[budgetStatus])}>
                        {Math.round(rawPercent)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
