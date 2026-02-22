'use client';

import { useMemo, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useCurrency } from '../../hooks/useCurrency';
import { Transaction } from '../../hooks/useTransactions';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useTranslation } from '../../i18n/LanguageContext';
import * as S from './styles';

interface TransactionListProps {
    transactions: Transaction[];
    handleEdit: (transaction: Transaction) => void;
    handleDelete: (id: string) => void;
    isUpdating: boolean;
    isDeleting: boolean;
}

type SortKey = 'date' | 'description' | 'category' | 'amount';
type SortDir = 'asc' | 'desc';

function getCategoryName(txn: Transaction): string {
    if (typeof txn.category === 'object' && txn.category !== null) {
        return txn.category.name;
    }
    return '';
}

function SortIcon({ columnKey, sortKey, sortDir }: Readonly<{ columnKey: SortKey; sortKey: SortKey; sortDir: SortDir }>) {
    if (sortKey !== columnKey) return <S.SortIconInactive />;
    return sortDir === 'asc'
        ? <FiChevronUp size={14} />
        : <FiChevronDown size={14} />;
}

export const TransactionList = ({ transactions, isDeleting, isUpdating, handleEdit, handleDelete }: TransactionListProps) => {
    const { selectedCurrencyCode } = useCurrency();
    const { t, locale } = useTranslation();

    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir(key === 'date' || key === 'amount' ? 'desc' : 'asc');
        }
    };

    const sorted = useMemo(() => {
        const copy = [...transactions];
        copy.sort((a, b) => {
            let cmp = 0;
            switch (sortKey) {
                case 'date':
                    cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
                    break;
                case 'description':
                    cmp = a.description.localeCompare(b.description, locale);
                    break;
                case 'category':
                    cmp = getCategoryName(a).localeCompare(getCategoryName(b), locale);
                    break;
                case 'amount':
                    cmp = a.amount - b.amount;
                    break;
            }
            return sortDir === 'asc' ? cmp : -cmp;
        });
        return copy;
    }, [transactions, sortKey, sortDir, locale]);

    return (
        <S.TableContainer>
            <S.ResponsiveTable>
                <thead>
                    <tr>
                        <S.SortableTh onClick={() => handleSort('date')} $active={sortKey === 'date'}>
                            {t.transactions.date}
                            <SortIcon columnKey="date" sortKey={sortKey} sortDir={sortDir} />
                        </S.SortableTh>
                        <S.SortableTh onClick={() => handleSort('description')} $active={sortKey === 'description'}>
                            {t.transactions.description}
                            <SortIcon columnKey="description" sortKey={sortKey} sortDir={sortDir} />
                        </S.SortableTh>
                        <S.SortableTh onClick={() => handleSort('category')} $active={sortKey === 'category'}>
                            {t.transactions.category}
                            <SortIcon columnKey="category" sortKey={sortKey} sortDir={sortDir} />
                        </S.SortableTh>
                        <th>{t.transactions.type}</th>
                        <th>{t.transactions.fixed}</th>
                        <S.SortableTh onClick={() => handleSort('amount')} $active={sortKey === 'amount'}>
                            {t.transactions.amount}
                            <SortIcon columnKey="amount" sortKey={sortKey} sortDir={sortDir} />
                        </S.SortableTh>
                        <th>{t.transactions.actions}</th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.map(transaction => (
                        <tr key={transaction._id}>
                            <td>{formatDate(`${transaction.date}`, locale)}</td>
                            <td>{transaction.description}</td>
                            <td>
                                {typeof transaction.category === 'object'
                                    ? transaction.category.name
                                    : t.transactions.uncategorized}
                            </td>
                            <td>
                                <S.TypeBadge $type={transaction.type}>
                                    {transaction.type}
                                </S.TypeBadge>
                            </td>
                            <td>
                                {transaction.is_fixed && (
                                    <S.TypeBadge $type="income">
                                        {t.transactions.fixed}
                                    </S.TypeBadge>
                                )}
                            </td>
                            <td>
                                <S.Amount $type={transaction.type}>
                                    {formatCurrency(transaction.amount, selectedCurrencyCode, locale)}
                                </S.Amount>
                            </td>
                            <td>
                                <S.ActionButtons>
                                    <S.EditButton
                                        onClick={() => handleEdit(transaction)}
                                        disabled={isUpdating}
                                    >
                                        {t.transactions.edit}
                                    </S.EditButton>
                                    <S.DeleteButton
                                        onClick={() => handleDelete(transaction._id)}
                                        disabled={isDeleting}
                                    >
                                        {t.transactions.delete}
                                    </S.DeleteButton>
                                </S.ActionButtons>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </S.ResponsiveTable>
        </S.TableContainer>
    );
};
