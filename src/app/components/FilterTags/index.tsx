'use client';

import React, { useMemo } from 'react';
import { IoClose } from 'react-icons/io5';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Category } from '../../hooks/useCategories';
import { useTranslation } from '../../i18n/LanguageContext';

interface FilterTagsProps {
    filters: { description?: string; category?: string; type?: string; minAmount?: string; maxAmount?: string; startDate?: string; endDate?: string; isFixed?: string };
    categories: Category[];
    resetFilters: () => void;
    removeFilter: (key: string) => void;
}

function getDefaultRange() {
    const now = new Date();
    return { start: format(startOfMonth(now), 'yyyy-MM-dd'), end: format(endOfMonth(now), 'yyyy-MM-dd') };
}

export function FilterTags({ filters, categories, resetFilters, removeFilter }: FilterTagsProps) {
    const { t } = useTranslation();
    const defaultRange = useMemo(getDefaultRange, []);

    const isFilterActive = useMemo(() => !!(
        (filters.description ?? '') || (filters.category ?? '') || (filters.type ?? '') ||
        (filters.minAmount ?? '') || (filters.maxAmount ?? '') || (filters.isFixed === 'true') ||
        (filters.startDate !== defaultRange.start || filters.endDate !== defaultRange.end)
    ), [filters, defaultRange]);

    const activeTags = useMemo(() => {
        const tags: { key: string; label: string }[] = [];
        if (filters.type) tags.push({ key: 'type', label: filters.type === 'income' ? t.filter.income : t.filter.expense });
        if (filters.category) {
            const cat = categories.find(c => c._id === filters.category);
            tags.push({ key: 'category', label: cat?.name ?? filters.category ?? '' });
        }
        if (filters.description) {
            const text = String(filters.description);
            tags.push({ key: 'description', label: text.length > 20 ? text.slice(0, 20) + '…' : text });
        }
        if (filters.minAmount) tags.push({ key: 'minAmount', label: `${t.filter.minAmount}: ${filters.minAmount}` });
        if (filters.maxAmount) tags.push({ key: 'maxAmount', label: `${t.filter.maxAmount}: ${filters.maxAmount}` });
        if (filters.isFixed === 'true') tags.push({ key: 'isFixed', label: t.filter.fixedOnly });
        if (filters.startDate && filters.endDate && (filters.startDate !== defaultRange.start || filters.endDate !== defaultRange.end)) {
            tags.push({ key: 'dateRange', label: `${filters.startDate} → ${filters.endDate}` });
        }
        return tags;
    }, [filters, categories, t, defaultRange]);

    if (!isFilterActive) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {activeTags.map(({ key, label }) => (
                <span key={key} className="inline-flex items-center gap-1.5 py-1 pl-2.5 pr-1 rounded-md bg-primary/10 text-primary text-[0.8rem] font-medium">
                    {label}
                    <button type="button" className="p-0.5 rounded hover:bg-primary/20 transition-colors" onClick={() => removeFilter(key)} aria-label="Remove filter">
                        <IoClose size={14} />
                    </button>
                </span>
            ))}
            <button type="button" className="inline-flex items-center py-1 px-2.5 rounded-md border border-danger text-danger text-[0.8rem] font-medium hover:bg-danger hover:text-white transition-colors" onClick={resetFilters}>
                {t.filter.clearAllFilters}
            </button>
        </div>
    );
}
