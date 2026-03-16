'use client';

import { useMemo, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiSettings } from 'react-icons/fi';
import { cn } from '@/app/lib/cn';
import { useDateFormat } from '../../contexts/DateFormatContext';
import { useCurrency } from '../../hooks/useCurrency';
import { Transaction } from '../../hooks/useTransactions';
import { formatCurrency } from '../../utils/formatters';
import { useTranslation } from '../../i18n/LanguageContext';

interface TransactionListProps {
    transactions: Transaction[];
    handleEdit: (transaction: Transaction) => void;
    handleDelete: (id: string) => void;
    handleBulkDelete: (ids: string[]) => Promise<void>;
    isUpdating: boolean;
    isDeleting: boolean;
    isBulkDeleting: boolean;
}

type SortKey = 'date' | 'description' | 'category' | 'amount';
type SortDir = 'asc' | 'desc';

const thBaseClasses =
    'p-3 text-left border-b border-gray-300 bg-surface font-semibold text-text-secondary text-[0.85rem] uppercase tracking-[0.5px]';

const tdBaseClasses =
    'p-3 text-left border-b border-gray-300 text-text-primary min-[1200px]:whitespace-nowrap';

function getCategoryName(txn: Transaction): string {
    if (typeof txn.category === 'object' && txn.category !== null) {
        return txn.category.name;
    }
    return '';
}

function SortIcon({ columnKey, sortKey, sortDir }: Readonly<{ columnKey: SortKey; sortKey: SortKey; sortDir: SortDir }>) {
    if (sortKey !== columnKey) return <span className="inline-block w-[14px] ml-1" />;
    return sortDir === 'asc'
        ? <FiChevronUp size={14} />
        : <FiChevronDown size={14} />;
}

export const TransactionList = ({ transactions, isDeleting, isUpdating, isBulkDeleting, handleEdit, handleDelete, handleBulkDelete }: TransactionListProps) => {
    const { selectedCurrencyCode } = useCurrency();
    const { t, locale } = useTranslation();
    const { formatDate } = useDateFormat();

    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === sorted.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(sorted.map(t => t._id)));
        }
    };

    const executeBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        
        const confirmMessage = t.transactions.confirmDeleteSelected 
            ? t.transactions.confirmDeleteSelected.replace('{count}', String(selectedIds.size))
            : `Are you sure you want to delete ${selectedIds.size} transactions?`;

        if (window.confirm(confirmMessage)) {
            await handleBulkDelete(Array.from(selectedIds));
            setSelectedIds(new Set());
            setIsSelectionMode(false);
        }
    };

    const executeDeleteAll = async () => {
        if (sorted.length === 0) return;

        const confirmMessage = t.transactions.confirmDeleteAll 
            ? t.transactions.confirmDeleteAll
            : `Are you sure you want to delete ALL ${sorted.length} visible transactions?`;

        if (window.confirm(confirmMessage)) {
            await handleBulkDelete(sorted.map(t => t._id));
            setSelectedIds(new Set());
            setIsSelectionMode(false);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-text-primary m-0">
                    {t.transactions.listTitle || 'Transactions'}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={executeDeleteAll}
                        disabled={isBulkDeleting || sorted.length === 0}
                        className="px-3 py-1.5 text-sm font-medium text-danger border border-danger rounded-lg hover:bg-danger hover:text-white transition-colors disabled:opacity-50"
                    >
                        {t.transactions.deleteAll || 'Delete All'}
                    </button>
                    {isSelectionMode ? (
                        <>
                            <button
                                onClick={executeBulkDelete}
                                disabled={isBulkDeleting || selectedIds.size === 0}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-danger border border-danger rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {t.transactions.deleteSelected || 'Delete Selected'} ({selectedIds.size})
                            </button>
                            <button
                                onClick={() => {
                                    setIsSelectionMode(false);
                                    setSelectedIds(new Set());
                                }}
                                className="px-3 py-1.5 text-sm font-medium text-text-secondary border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                {t.editModal.cancel}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsSelectionMode(true)}
                            className="px-3 py-1.5 text-sm font-medium text-danger border border-danger rounded-lg hover:bg-danger hover:text-white transition-colors"
                        >
                            {t.transactions.deleteSelected || 'Delete Selected'}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile: cards */}
            <div className="hidden flex-col gap-3 my-4 max-[859px]:flex">
                {isSelectionMode && (
                    <div className="flex items-center gap-2 px-1 mb-2">
                        <input
                            type="checkbox"
                            checked={sorted.length > 0 && selectedIds.size === sorted.length}
                            onChange={toggleSelectAll}
                            className="w-5 h-5 accent-primary"
                        />
                        <span className="text-sm text-text-secondary">{t.transactions.selectAll || 'Select All'}</span>
                    </div>
                )}
                
                {sorted.map((transaction) => {
                    const expanded = expandedIds.has(transaction._id);
                    const isSelected = selectedIds.has(transaction._id);
                    
                    return (
                        <div
                            key={transaction._id}
                            className={cn(
                                "bg-surface border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-colors",
                                isSelectionMode && isSelected ? "border-primary bg-primary/[0.02]" : "border-gray-300"
                            )}
                            onClick={() => {
                                if (isSelectionMode) toggleSelection(transaction._id);
                            }}
                        >
                            <div className="p-4 flex gap-3">
                                {isSelectionMode && (
                                    <div className="flex items-start pt-1">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelection(transaction._id)}
                                            className="w-5 h-5 accent-primary"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2 mb-1">
                                        <div className="font-semibold text-base text-text-primary flex-1 min-w-0 break-words">
                                            {transaction.description}
                                        </div>
                                        <span
                                            className={cn(
                                                'font-bold text-base shrink-0',
                                                transaction.type === 'income' ? 'text-success' : 'text-danger'
                                            )}
                                        >
                                            {formatCurrency(transaction.amount, selectedCurrencyCode, locale)}
                                        </span>
                                    </div>
                                    <div className="text-[0.8rem] text-text-secondary mb-2">
                                        {formatDate(`${transaction.date}`, locale as 'en' | 'pt' | 'es')}
                                    </div>
                                    {!isSelectionMode && (
                                        <button
                                            type="button"
                                            className="bg-none border-none p-0 text-[0.9rem] font-semibold text-primary cursor-pointer mt-1 hover:underline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleExpanded(transaction._id);
                                            }}
                                        >
                                            {expanded ? t.transactions.seeLess : t.transactions.seeMore}
                                        </button>
                                    )}
                                </div>
                            </div>
                            {expanded && !isSelectionMode && (
                                <div className="p-4 pt-3 border-t border-gray-300">
                                    <div className="[&:not(:first-child)]:mt-3">
                                        <div className="text-xs text-text-secondary mb-[0.15rem]">{t.transactions.category}</div>
                                        <div className="text-[0.95rem] font-medium text-text-primary">
                                            {typeof transaction.category === 'object'
                                                ? transaction.category.name
                                                : t.transactions.uncategorized}
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-xs text-text-secondary mb-[0.15rem]">{t.transactions.type}</div>
                                        <div className="text-[0.95rem] font-medium text-text-primary">
                                            {transaction.type === 'income' ? t.transactions.income : t.transactions.expense}
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-xs text-text-secondary mb-[0.15rem]">{t.transactions.amount}</div>
                                        <div className="text-[0.95rem] font-medium text-text-primary">
                                            {formatCurrency(transaction.amount, selectedCurrencyCode, locale)}
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-xs text-text-secondary mb-[0.15rem]">{t.transactions.fixed}</div>
                                        <div className="text-[0.95rem] font-medium text-text-primary">
                                            {transaction.is_fixed ? t.transactions.fixed : '—'}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            type="button"
                                            className="flex-1 py-2 px-3 rounded-lg border border-primary bg-transparent text-primary font-semibold text-[0.9rem] cursor-pointer hover:bg-primary hover:text-white"
                                            onClick={() => handleEdit(transaction)}
                                            disabled={isUpdating}
                                        >
                                            {t.transactions.edit}
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 py-2 px-3 rounded-lg border-none bg-danger text-white font-semibold text-[0.9rem] cursor-pointer hover:opacity-90"
                                            onClick={() => handleDelete(transaction._id)}
                                            disabled={isDeleting}
                                        >
                                            {t.transactions.delete}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Desktop: table */}
            <div className="block max-[859px]:hidden">
                <div className="w-full overflow-x-auto my-4">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {isSelectionMode && (
                                    <th className={cn(thBaseClasses, 'w-[40px] text-center')}>
                                        <input
                                            type="checkbox"
                                            checked={sorted.length > 0 && selectedIds.size === sorted.length}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 accent-primary cursor-pointer"
                                        />
                                    </th>
                                )}
                                <th
                                    className={cn(
                                        thBaseClasses,
                                        'cursor-pointer select-none transition-colors duration-150 [&>svg]:align-middle [&>svg]:ml-1 hover:!text-primary',
                                        sortKey === 'date' ? '!text-primary' : '',
                                        'min-[1200px]:whitespace-nowrap min-[1200px]:w-[15%]'
                                    )}
                                    onClick={() => handleSort('date')}
                                >
                                    {t.transactions.date}
                                    <SortIcon columnKey="date" sortKey={sortKey} sortDir={sortDir} />
                                </th>
                                <th
                                    className={cn(
                                        thBaseClasses,
                                        'cursor-pointer select-none transition-colors duration-150 [&>svg]:align-middle [&>svg]:ml-1 hover:!text-primary',
                                        sortKey === 'description' ? '!text-primary' : '',
                                        'min-[1200px]:whitespace-nowrap min-[1200px]:w-[25%]'
                                    )}
                                    onClick={() => handleSort('description')}
                                >
                                    {t.transactions.description}
                                    <SortIcon columnKey="description" sortKey={sortKey} sortDir={sortDir} />
                                </th>
                                <th
                                    className={cn(
                                        thBaseClasses,
                                        'cursor-pointer select-none transition-colors duration-150 [&>svg]:align-middle [&>svg]:ml-1 hover:!text-primary',
                                        sortKey === 'category' ? '!text-primary' : '',
                                        'min-[1200px]:whitespace-nowrap min-[1200px]:w-[20%]'
                                    )}
                                    onClick={() => handleSort('category')}
                                >
                                    {t.transactions.category}
                                    <SortIcon columnKey="category" sortKey={sortKey} sortDir={sortDir} />
                                </th>
                                <th className={cn(thBaseClasses, 'min-[1200px]:whitespace-nowrap min-[1200px]:w-[10%]')}>
                                    {t.transactions.type}
                                </th>
                                <th className={cn(thBaseClasses, 'min-[1200px]:whitespace-nowrap min-[1200px]:w-[8%]')}>
                                    {t.transactions.fixed}
                                </th>
                                <th
                                    className={cn(
                                        thBaseClasses,
                                        'cursor-pointer select-none transition-colors duration-150 [&>svg]:align-middle [&>svg]:ml-1 hover:!text-primary',
                                        sortKey === 'amount' ? '!text-primary' : '',
                                        'min-[1200px]:whitespace-nowrap min-[1200px]:w-[15%]'
                                    )}
                                    onClick={() => handleSort('amount')}
                                >
                                    {t.transactions.amount}
                                    <SortIcon columnKey="amount" sortKey={sortKey} sortDir={sortDir} />
                                </th>
                                <th className={cn(thBaseClasses, 'min-[1200px]:whitespace-nowrap min-[1200px]:w-[15%]')}>
                                    {t.transactions.actions}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map(transaction => {
                                const isSelected = selectedIds.has(transaction._id);
                                return (
                                    <tr 
                                        key={transaction._id} 
                                        className={cn(
                                            "hover:bg-gray-200 transition-colors",
                                            isSelectionMode && isSelected && "bg-primary/[0.04]"
                                        )}
                                        onClick={() => {
                                            if (isSelectionMode) toggleSelection(transaction._id);
                                        }}
                                    >
                                        {isSelectionMode && (
                                            <td className={cn(tdBaseClasses, "text-center")}>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelection(transaction._id)}
                                                    className="w-4 h-4 accent-primary cursor-pointer"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </td>
                                        )}
                                        <td className={tdBaseClasses}>
                                            {formatDate(`${transaction.date}`, locale as 'en' | 'pt' | 'es')}
                                        </td>
                                        <td className={tdBaseClasses}>{transaction.description}</td>
                                        <td className={tdBaseClasses}>
                                            {typeof transaction.category === 'object'
                                                ? transaction.category.name
                                                : t.transactions.uncategorized}
                                        </td>
                                        <td className={tdBaseClasses}>
                                            <span
                                                className={cn(
                                                    'inline-block px-[0.6rem] py-1 rounded-full text-xs font-semibold',
                                                    transaction.type === 'income'
                                                        ? 'bg-success/[0.13] text-success'
                                                        : 'bg-danger/[0.13] text-danger'
                                                )}
                                            >
                                                {transaction.type}
                                            </span>
                                        </td>
                                        <td className={tdBaseClasses}>
                                            {transaction.is_fixed && (
                                                <span className="inline-block px-[0.6rem] py-1 rounded-full text-xs font-semibold bg-success/[0.13] text-success">
                                                    {t.transactions.fixed}
                                                </span>
                                            )}
                                        </td>
                                        <td className={tdBaseClasses}>
                                            <span
                                                className={cn(
                                                    'font-bold',
                                                    transaction.type === 'income' ? 'text-success' : 'text-danger'
                                                )}
                                            >
                                                {formatCurrency(transaction.amount, selectedCurrencyCode, locale)}
                                            </span>
                                        </td>
                                        <td className={tdBaseClasses}>
                                            <div className="flex gap-2">
                                                <button
                                                    className="py-[0.3rem] px-[0.65rem] bg-primary text-white border-none rounded-md cursor-pointer text-[0.8rem] font-medium transition-opacity duration-200 hover:opacity-85 disabled:opacity-50"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(transaction);
                                                    }}
                                                    disabled={isUpdating || isSelectionMode}
                                                >
                                                    {t.transactions.edit}
                                                </button>
                                                <button
                                                    className="py-[0.3rem] px-[0.65rem] bg-gray-300 text-text-primary border-none rounded-md cursor-pointer text-[0.8rem] font-medium transition-all duration-200 hover:bg-danger hover:text-white disabled:opacity-50"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(transaction._id);
                                                    }}
                                                    disabled={isDeleting || isSelectionMode}
                                                >
                                                    {t.transactions.delete}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};
