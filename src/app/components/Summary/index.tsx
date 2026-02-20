'use client'

import { useCurrency } from '../../hooks/useCurrency';
import { Transaction } from '../../hooks/useTransactions';
import { formatCurrency } from '../../utils/formatters';
import { useTranslation } from '../../i18n/LanguageContext';
import * as S from './styles';

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

    // Get totals from all transactions
    const totals = calculateTotals();


    return (
        <S.SummaryCard>
            <S.SummaryItem>
                <span>{t.summary.income}</span>
                <S.AmountPositive>{formatCurrency(totals.income, selectedCurrencyCode, locale)}</S.AmountPositive>
            </S.SummaryItem>
            <S.SummaryItem>
                <span>{t.summary.expense}</span>
                <S.AmountNegative>{formatCurrency(totals.expense, selectedCurrencyCode, locale)}</S.AmountNegative>
            </S.SummaryItem>
            <S.SummaryItem>
                <span>{t.summary.balance}</span>
                <S.AmountBalance $positive={totals.balance > 0}>
                    {formatCurrency(totals.balance, selectedCurrencyCode, locale)}
                </S.AmountBalance>
            </S.SummaryItem>
            <S.SummaryItem>
                <span>{t.summary.transactionCount}</span>
                <span>{totalCount}</span>
            </S.SummaryItem>
        </S.SummaryCard>
    );
};

