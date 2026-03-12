'use client'

import { cn } from '@/app/lib/cn';
import { useCurrency } from '../../hooks/useCurrency';
import { Transaction } from '../../hooks/useTransactions';
import { formatCurrency } from '../../utils/formatters';
import { useTranslation } from '../../i18n/LanguageContext';

interface SummaryProps {
    transactions: Transaction[]
    totalCount: number
}

export const Summary = ({ transactions, totalCount }: SummaryProps) => {
    const { t, locale } = useTranslation();
    const { selectedCurrencyCode } = useCurrency();

    const calculateTotals = () => {
        return transactions.reduce((acc, transaction) => {
            if (transaction.type === 'income') {
                acc.income += transaction.amount;
            } else {
                acc.expense += transaction.amount;
            }
            acc.balance = acc.income - acc.expense;
            return acc;
        }, { income: 0, expense: 0, balance: 0 });
    };

    const totals = calculateTotals();

    return (
        <div className="flex flex-col gap-3 bg-surface text-text-primary p-4 rounded-xl border border-gray-300 min-[1200px]:grid min-[1200px]:grid-cols-4">
            <div className="flex gap-2 p-2">
                <span>{t.summary.income}</span>
                <span className="text-success font-bold">{formatCurrency(totals.income, selectedCurrencyCode, locale)}</span>
            </div>
            <div className="flex gap-2 p-2">
                <span>{t.summary.expense}</span>
                <span className="text-danger font-bold">{formatCurrency(totals.expense, selectedCurrencyCode, locale)}</span>
            </div>
            <div className="flex gap-2 p-2">
                <span>{t.summary.balance}</span>
                <span className={cn("font-bold", totals.balance > 0 ? "text-success" : "text-danger")}>
                    {formatCurrency(totals.balance, selectedCurrencyCode, locale)}
                </span>
            </div>
            <div className="flex gap-2 p-2">
                <span>{t.summary.transactionCount}</span>
                <span>{totalCount}</span>
            </div>
        </div>
    );
};
