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
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpanded = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

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
        <>
            {/* Mobile: cards */}
            <S.MobileCardsList>
                {sorted.map((transaction) => {
                    const expanded = expandedIds.has(transaction._id);
                    return (
                        <S.MobileCard key={transaction._id}>
                            <S.MobileCardHeader>
                                <S.MobileCardTop>
                                    <S.MobileCardDescription>{transaction.description}</S.MobileCardDescription>
                                    <S.MobileCardAmount $type={transaction.type}>
                                        {formatCurrency(transaction.amount, selectedCurrencyCode, locale)}
                                    </S.MobileCardAmount>
                                </S.MobileCardTop>
                                <S.MobileCardDate>
                                    {formatDate(`${transaction.date}`, locale)}
                                </S.MobileCardDate>
                                <S.MobileCardVerMais type="button" onClick={() => toggleExpanded(transaction._id)}>
                                    {expanded ? t.transactions.seeLess : t.transactions.seeMore}
                                </S.MobileCardVerMais>
                            </S.MobileCardHeader>
                            {expanded && (
                                <S.MobileCardExpanded>
                                    <S.MobileCardDetailRow>
                                        <S.MobileCardDetailLabel>{t.transactions.category}</S.MobileCardDetailLabel>
                                        <S.MobileCardDetailValue>
                                            {typeof transaction.category === 'object'
                                                ? transaction.category.name
                                                : t.transactions.uncategorized}
                                        </S.MobileCardDetailValue>
                                    </S.MobileCardDetailRow>
                                    <S.MobileCardDetailRow>
                                        <S.MobileCardDetailLabel>{t.transactions.type}</S.MobileCardDetailLabel>
                                        <S.MobileCardDetailValue>
                                            {transaction.type === 'income' ? t.transactions.income : t.transactions.expense}
                                        </S.MobileCardDetailValue>
                                    </S.MobileCardDetailRow>
                                    <S.MobileCardDetailRow>
                                        <S.MobileCardDetailLabel>{t.transactions.amount}</S.MobileCardDetailLabel>
                                        <S.MobileCardDetailValue>
                                            {formatCurrency(transaction.amount, selectedCurrencyCode, locale)}
                                        </S.MobileCardDetailValue>
                                    </S.MobileCardDetailRow>
                                    <S.MobileCardDetailRow>
                                        <S.MobileCardDetailLabel>{t.transactions.fixed}</S.MobileCardDetailLabel>
                                        <S.MobileCardDetailValue>
                                            {transaction.is_fixed ? t.transactions.fixed : '—'}
                                        </S.MobileCardDetailValue>
                                    </S.MobileCardDetailRow>
                                    <S.MobileCardActions>
                                        <S.MobileCardEditBtn
                                            type="button"
                                            onClick={() => handleEdit(transaction)}
                                            disabled={isUpdating}
                                        >
                                            {t.transactions.edit}
                                        </S.MobileCardEditBtn>
                                        <S.MobileCardDeleteBtn
                                            type="button"
                                            onClick={() => handleDelete(transaction._id)}
                                            disabled={isDeleting}
                                        >
                                            {t.transactions.delete}
                                        </S.MobileCardDeleteBtn>
                                    </S.MobileCardActions>
                                </S.MobileCardExpanded>
                            )}
                        </S.MobileCard>
                    );
                })}
            </S.MobileCardsList>

            {/* Desktop: tabela */}
            <S.TableWrapper>
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
            </S.TableWrapper>
        </>
    );
};
