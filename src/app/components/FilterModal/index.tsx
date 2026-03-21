'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NumericFormat, NumberFormatValues } from 'react-number-format';
import { addMonths, endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { Category } from '../../hooks/useCategories';
import { useCurrency } from '../../hooks/useCurrency';
import { useTranslation } from '../../i18n/LanguageContext';
import { DateInput } from '../DateInput';
import { cn } from '@/app/lib/cn';

function getCurrencyConfig(code: string) {
    switch (code) {
        case 'BRL': return { prefix: 'R$ ', thousandSeparator: '.', decimalSeparator: ',' };
        case 'EUR': return { prefix: '€ ', thousandSeparator: '.', decimalSeparator: ',' };
        default:    return { prefix: '$ ', thousandSeparator: ',', decimalSeparator: '.' };
    }
}

export interface FilterValues {
    description?: string;
    category?: string;
    type?: string;
    minAmount?: string;
    maxAmount?: string;
    startDate?: string;
    endDate?: string;
    isFixed?: string;
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FilterValues) => void;
    filters: FilterValues;
    categories: Category[];
}

const fieldClass = "py-3 px-4 rounded-xl text-[0.95rem] w-full bg-surface border border-gray-300 text-text-primary font-[inherit] transition-[border-color] duration-200 placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

export function FilterModal({ isOpen, onClose, onApply, filters: initialFilters, categories }: FilterModalProps) {
    const { t } = useTranslation();
    const { selectedCurrencyCode } = useCurrency();
    const [draft, setDraft] = useState<FilterValues>(initialFilters);

    useEffect(() => {
        if (isOpen) setDraft(initialFilters);
    }, [isOpen, initialFilters]);

    const currencyConfig = getCurrencyConfig(selectedCurrencyCode);

    const updateDraft = useCallback((name: string, value: string) => {
        setDraft(prev => {
            const next = { ...prev, [name]: value };
            if (name === 'startDate' && !next.endDate) next.endDate = value;
            return next;
        });
    }, []);

    const handleAmountChange = useCallback((name: string) => (values: NumberFormatValues) => {
        updateDraft(name, values.value);
    }, [updateDraft]);

    const quickRanges = useMemo(() => {
        const today = new Date();
        const nextMonth = addMonths(today, 1);
        return {
            nextMonth:   { start: format(startOfMonth(nextMonth), 'yyyy-MM-dd'), end: format(endOfMonth(nextMonth), 'yyyy-MM-dd') },
            thisMonth:   { start: format(startOfMonth(today), 'yyyy-MM-dd'), end: format(endOfMonth(today), 'yyyy-MM-dd') },
            lastMonth:   { start: format(startOfMonth(subMonths(today, 1)), 'yyyy-MM-dd'), end: format(endOfMonth(subMonths(today, 1)), 'yyyy-MM-dd') },
            last3Months: { start: format(startOfMonth(subMonths(today, 2)), 'yyyy-MM-dd'), end: format(endOfMonth(today), 'yyyy-MM-dd') },
            last6Months: { start: format(startOfMonth(subMonths(today, 5)), 'yyyy-MM-dd'), end: format(endOfMonth(today), 'yyyy-MM-dd') },
            lastYear:    { start: format(startOfMonth(subMonths(today, 11)), 'yyyy-MM-dd'), end: format(endOfMonth(today), 'yyyy-MM-dd') },
        };
    }, []);

    const isActive = (key: keyof typeof quickRanges) =>
        draft.startDate === quickRanges[key].start && draft.endDate === quickRanges[key].end;

    const applyQuickDate = (monthsBack: number) => {
        const today = new Date();
        const start = startOfMonth(monthsBack === 0 ? today : subMonths(today, monthsBack));
        const end = endOfMonth(today);
        updateDraft('startDate', format(start, 'yyyy-MM-dd'));
        updateDraft('endDate', format(end, 'yyyy-MM-dd'));
    };

    const applyNextMonth = () => {
        const nextMonth = addMonths(new Date(), 1);
        updateDraft('startDate', format(startOfMonth(nextMonth), 'yyyy-MM-dd'));
        updateDraft('endDate', format(endOfMonth(nextMonth), 'yyyy-MM-dd'));
    };

    const applyLastMonth = () => {
        const lastMonth = subMonths(new Date(), 1);
        updateDraft('startDate', format(startOfMonth(lastMonth), 'yyyy-MM-dd'));
        updateDraft('endDate', format(endOfMonth(lastMonth), 'yyyy-MM-dd'));
    };

    const handleApply = () => {
        onApply(draft);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-surface w-full max-w-[420px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border border-gray-200">
                <div className="sticky top-0 bg-surface flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-text-primary m-0">{t.filter.modalTitle}</h3>
                    <button
                        type="button"
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:bg-gray-200 hover:text-text-primary transition-colors text-xl font-medium"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4">
                    <div className="mb-[10px]">
                        <label className="block text-xs font-medium text-text-secondary mb-2">{t.filter.description}</label>
                        <input
                            type="text"
                            placeholder={t.filter.description}
                            value={String(draft.description ?? '')}
                            onChange={(e) => updateDraft('description', e.target.value)}
                            className={fieldClass}
                        />
                    </div>

                    <div className="mb-[10px]">
                        <label className="block text-xs font-medium text-text-secondary mb-2">{t.transactionForm.category}</label>
                        <select
                            value={draft.category ?? ''}
                            onChange={(e) => updateDraft('category', e.target.value)}
                            className={fieldClass}
                        >
                            <option value="">{t.filter.allCategories}</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-[10px]">
                        <label className="block text-xs font-medium text-text-secondary mb-2">{t.transactionForm.type}</label>
                        <select
                            value={draft.type ?? ''}
                            onChange={(e) => updateDraft('type', e.target.value)}
                            className={fieldClass}
                        >
                            <option value="">{t.filter.allTypes}</option>
                            <option value="income">{t.filter.income}</option>
                            <option value="expense">{t.filter.expense}</option>
                        </select>
                    </div>

                    <div className="mb-[10px]">
                        <label className="block text-xs font-medium text-text-secondary mb-2">{t.filter.startDate} / {t.filter.endDate}</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {[
                                { key: 'nextMonth' as const, fn: applyNextMonth, label: t.filter.nextMonth },
                                { key: 'thisMonth' as const, fn: () => applyQuickDate(0), label: t.filter.thisMonth },
                                { key: 'lastMonth' as const, fn: applyLastMonth, label: t.filter.lastMonth },
                                { key: 'last3Months' as const, fn: () => applyQuickDate(2), label: t.filter.last3Months },
                                { key: 'last6Months' as const, fn: () => applyQuickDate(5), label: t.filter.last6Months },
                                { key: 'lastYear' as const, fn: () => applyQuickDate(11), label: t.filter.lastYear },
                            ].map(({ key, fn, label }) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={cn(
                                        "py-2 px-3 rounded-lg text-[0.8rem] font-medium transition-colors",
                                        isActive(key) ? "bg-primary text-white" : "border border-primary text-primary hover:bg-primary/10"
                                    )}
                                    onClick={fn}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div>
                                <span className="text-xs text-text-secondary block mb-1">{t.filter.startDate}</span>
                                <DateInput value={String(draft.startDate ?? '')} onChange={(v) => updateDraft('startDate', v)} />
                            </div>
                            <div>
                                <span className="text-xs text-text-secondary block mb-1">{t.filter.endDate}</span>
                                <DateInput value={String(draft.endDate ?? '')} onChange={(v) => updateDraft('endDate', v)} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-[10px]">
                        <div>
                            <label className="block text-xs font-medium text-text-secondary mb-2">{t.filter.minAmount}</label>
                            <NumericFormat
                                className={fieldClass}
                                placeholder={t.filter.minAmount}
                                value={draft.minAmount ?? ''}
                                onValueChange={handleAmountChange('minAmount')}
                                thousandSeparator={currencyConfig.thousandSeparator}
                                decimalSeparator={currencyConfig.decimalSeparator}
                                prefix={currencyConfig.prefix}
                                decimalScale={2}
                                allowNegative={false}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-secondary mb-2">{t.filter.maxAmount}</label>
                            <NumericFormat
                                className={fieldClass}
                                placeholder={t.filter.maxAmount}
                                value={draft.maxAmount ?? ''}
                                onValueChange={handleAmountChange('maxAmount')}
                                thousandSeparator={currencyConfig.thousandSeparator}
                                decimalSeparator={currencyConfig.decimalSeparator}
                                prefix={currencyConfig.prefix}
                                decimalScale={2}
                                allowNegative={false}
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-3 py-2 cursor-pointer mb-[10px]">
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-primary cursor-pointer"
                            checked={draft.isFixed === 'true'}
                            onChange={(e) => updateDraft('isFixed', e.target.checked ? 'true' : '')}
                        />
                        <span className="text-[0.95rem] text-text-primary">{t.filter.fixedOnly}</span>
                    </label>
                </div>

                <div className="sticky bottom-0 p-4 border-t border-gray-200 bg-surface flex gap-3">
                    <button
                        type="button"
                        className="flex-1 py-3.5 rounded-xl font-semibold text-[0.95rem] bg-primary text-white hover:opacity-90 transition-opacity"
                        onClick={handleApply}
                    >
                        {t.filter.apply}
                    </button>
                    <button
                        type="button"
                        className="px-5 py-3.5 rounded-xl font-semibold text-[0.95rem] border border-gray-300 text-text-primary hover:bg-gray-100 transition-colors"
                        onClick={onClose}
                    >
                        {t.editModal.cancel}
                    </button>
                </div>
            </div>
        </div>
    );
}
