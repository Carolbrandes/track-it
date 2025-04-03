'use client'

import { Transaction } from '../../hooks/useTransactions';
import { formatCurrency } from '../../utils/formatters';
import * as S from './styles';

interface SummaryProps {
    transactions: Transaction[]
    totalCount: number
}

export const Summary = ({ transactions, totalCount }: SummaryProps) => {

    const totals = transactions.reduce((acc, transaction) => {
        if (transaction.type === 'income') {
            acc.income += transaction.amount;
        } else {
            acc.expense += transaction.amount;
        }
        acc.balance = acc.income - acc.expense;
        return acc;
    }, { income: 0, expense: 0, balance: 0 });


    return (
        <S.SummaryCard>
            <S.SummaryItem>
                <span>Income:</span>
                <S.AmountPositive>{formatCurrency(totals.income)}</S.AmountPositive>
            </S.SummaryItem>
            <S.SummaryItem>
                <span>Expense:</span>
                <S.AmountNegative>{formatCurrency(totals.expense)}</S.AmountNegative>
            </S.SummaryItem>
            <S.SummaryItem>
                <span>Balance:</span>
                <S.AmountBalance $positive={totals.balance >= 0}>
                    {formatCurrency(totals.balance)}
                </S.AmountBalance>
            </S.SummaryItem>
            <S.SummaryItem>
                <span>Number of Transactions:</span>
                <span>{totalCount}</span>
            </S.SummaryItem>
        </S.SummaryCard>
    );
};

