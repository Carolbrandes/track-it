'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { NumericFormat, NumberFormatValues } from 'react-number-format';
import { RiChatDeleteLine } from "react-icons/ri";
import { TfiFilter } from "react-icons/tfi";
import { addMonths, endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { Category } from '../../hooks/useCategories';
import { useCurrency } from '../../hooks/useCurrency';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { useTranslation } from '../../i18n/LanguageContext';
import { DateInput } from '../DateInput';
import { cn } from '@/app/lib/cn';

interface IFilter {
    description?: { $regex: string; $options: string } | string;
    category?: string;
    type?: string;
    amount?: { $gte?: number; $lte?: number } | string;
    date?: { $gte?: Date; $lte?: Date } | Date;
    userId?: string;
    minAmount?: number | string;
    maxAmount?: number | string;
    startDate?: string;
    endDate?: string;
    isFixed?: string;
}

interface FilterProps {
    filters: IFilter;
    categories: Category[];
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    resetFilters: () => void;
}

function getCurrencyConfig(code: string) {
    switch (code) {
        case 'BRL': return { prefix: 'R$ ', thousandSeparator: '.', decimalSeparator: ',' };
        case 'EUR': return { prefix: '€ ', thousandSeparator: '.', decimalSeparator: ',' };
        default:    return { prefix: '$ ', thousandSeparator: ',', decimalSeparator: '.' };
    }
}

const filterFieldClass =
    "py-[0.55rem] px-3 rounded-lg text-[0.9rem] w-full bg-surface border border-gray-300 text-text-primary font-[inherit] transition-[border-color] duration-200 placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10";

export const Filter = ({ filters, categories = [], handleFilterChange, resetFilters }: FilterProps) => {
    const { isMobile } = useDeviceDetect();
    const [showFilters, setShowFilters] = useState(false);
    const { t } = useTranslation();
    const { selectedCurrencyCode } = useCurrency();

    const currencyConfig = getCurrencyConfig(selectedCurrencyCode);

    const fireSyntheticChange = useCallback((name: string, value: string) => {
        const syntheticEvent = {
            target: { name, value },
        } as React.ChangeEvent<HTMLInputElement>;
        handleFilterChange(syntheticEvent);
    }, [handleFilterChange]);

    const handleAmountChange = useCallback((name: string) => (values: NumberFormatValues) => {
        fireSyntheticChange(name, values.value);
    }, [fireSyntheticChange]);

    const applyQuickDateFilter = useCallback((monthsBack: number) => {
        const today = new Date();
        const start = startOfMonth(monthsBack === 0 ? today : subMonths(today, monthsBack));
        const end = endOfMonth(today);
        fireSyntheticChange('startDate', format(start, 'yyyy-MM-dd'));
        fireSyntheticChange('endDate', format(end, 'yyyy-MM-dd'));
    }, [fireSyntheticChange]);

    const applyNextMonthFilter = useCallback(() => {
        const nextMonth = addMonths(new Date(), 1);
        fireSyntheticChange('startDate', format(startOfMonth(nextMonth), 'yyyy-MM-dd'));
        fireSyntheticChange('endDate', format(endOfMonth(nextMonth), 'yyyy-MM-dd'));
    }, [fireSyntheticChange]);

    const applyLastMonthFilter = useCallback(() => {
        const lastMonth = subMonths(new Date(), 1);
        fireSyntheticChange('startDate', format(startOfMonth(lastMonth), 'yyyy-MM-dd'));
        fireSyntheticChange('endDate', format(endOfMonth(lastMonth), 'yyyy-MM-dd'));
    }, [fireSyntheticChange]);

    const quickRanges = useMemo(() => {
        const today = new Date();
        const nextMonth = addMonths(today, 1);
        return {
            nextMonth:   { start: format(startOfMonth(nextMonth),           'yyyy-MM-dd'), end: format(endOfMonth(nextMonth),           'yyyy-MM-dd') },
            thisMonth:   { start: format(startOfMonth(today),               'yyyy-MM-dd'), end: format(endOfMonth(today),               'yyyy-MM-dd') },
            lastMonth:   { start: format(startOfMonth(subMonths(today, 1)), 'yyyy-MM-dd'), end: format(endOfMonth(subMonths(today, 1)),  'yyyy-MM-dd') },
            last3Months: { start: format(startOfMonth(subMonths(today, 2)), 'yyyy-MM-dd'), end: format(endOfMonth(today),               'yyyy-MM-dd') },
            last6Months: { start: format(startOfMonth(subMonths(today, 5)), 'yyyy-MM-dd'), end: format(endOfMonth(today),         'yyyy-MM-dd') },
            lastYear:    { start: format(startOfMonth(subMonths(today, 11)),'yyyy-MM-dd'), end: format(endOfMonth(today),         'yyyy-MM-dd') },
        };
    }, []);

    const isActive = (key: keyof typeof quickRanges) =>
        filters.startDate === quickRanges[key].start && filters.endDate === quickRanges[key].end;

    const filterContent = () => (
        <div className="flex flex-col gap-4 mb-6 min-[900px]:grid min-[900px]:grid-cols-2 min-[900px]:items-start">
            <div className="flex flex-col gap-2.5">
                <input
                    type="text"
                    name="description"
                    placeholder={t.filter.description}
                    value={String(filters.description) || ''}
                    onChange={handleFilterChange}
                    className={filterFieldClass}
                />
                <select
                    name="category"
                    value={filters.category || ''}
                    onChange={handleFilterChange}
                    className={filterFieldClass}
                >
                    <option value="">{t.filter.allCategories}</option>
                    {categories.map(category => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select
                    name="type"
                    value={filters.type || ''}
                    onChange={handleFilterChange}
                    className={filterFieldClass}
                >
                    <option value="">{t.filter.allTypes}</option>
                    <option value="income">{t.filter.income}</option>
                    <option value="expense">{t.filter.expense}</option>
                </select>
                <div className="flex flex-wrap gap-[0.4rem]">
                    <button
                        type="button"
                        className={cn(
                            "border border-primary py-[0.3rem] px-[0.65rem] rounded-full text-[0.78rem] font-[inherit] cursor-pointer whitespace-nowrap transition-all duration-150 hover:bg-primary hover:text-white",
                            isActive('nextMonth') ? "bg-primary text-white font-semibold" : "bg-transparent text-primary font-medium"
                        )}
                        onClick={applyNextMonthFilter}
                    >
                        {t.filter.nextMonth}
                    </button>
                    <button
                        type="button"
                        className={cn(
                            "border border-primary py-[0.3rem] px-[0.65rem] rounded-full text-[0.78rem] font-[inherit] cursor-pointer whitespace-nowrap transition-all duration-150 hover:bg-primary hover:text-white",
                            isActive('thisMonth') ? "bg-primary text-white font-semibold" : "bg-transparent text-primary font-medium"
                        )}
                        onClick={() => applyQuickDateFilter(0)}
                    >
                        {t.filter.thisMonth}
                    </button>
                    <button
                        type="button"
                        className={cn(
                            "border border-primary py-[0.3rem] px-[0.65rem] rounded-full text-[0.78rem] font-[inherit] cursor-pointer whitespace-nowrap transition-all duration-150 hover:bg-primary hover:text-white",
                            isActive('lastMonth') ? "bg-primary text-white font-semibold" : "bg-transparent text-primary font-medium"
                        )}
                        onClick={applyLastMonthFilter}
                    >
                        {t.filter.lastMonth}
                    </button>
                    <button
                        type="button"
                        className={cn(
                            "border border-primary py-[0.3rem] px-[0.65rem] rounded-full text-[0.78rem] font-[inherit] cursor-pointer whitespace-nowrap transition-all duration-150 hover:bg-primary hover:text-white",
                            isActive('last3Months') ? "bg-primary text-white font-semibold" : "bg-transparent text-primary font-medium"
                        )}
                        onClick={() => applyQuickDateFilter(2)}
                    >
                        {t.filter.last3Months}
                    </button>
                    <button
                        type="button"
                        className={cn(
                            "border border-primary py-[0.3rem] px-[0.65rem] rounded-full text-[0.78rem] font-[inherit] cursor-pointer whitespace-nowrap transition-all duration-150 hover:bg-primary hover:text-white",
                            isActive('last6Months') ? "bg-primary text-white font-semibold" : "bg-transparent text-primary font-medium"
                        )}
                        onClick={() => applyQuickDateFilter(5)}
                    >
                        {t.filter.last6Months}
                    </button>
                    <button
                        type="button"
                        className={cn(
                            "border border-primary py-[0.3rem] px-[0.65rem] rounded-full text-[0.78rem] font-[inherit] cursor-pointer whitespace-nowrap transition-all duration-150 hover:bg-primary hover:text-white",
                            isActive('lastYear') ? "bg-primary text-white font-semibold" : "bg-transparent text-primary font-medium"
                        )}
                        onClick={() => applyQuickDateFilter(11)}
                    >
                        {t.filter.lastYear}
                    </button>
                </div>
                <div className="flex flex-col gap-[0.2rem]">
                    <span className="text-xs font-medium text-text-secondary">{t.filter.startDate}</span>
                    <DateInput
                        name="startDate"
                        value={String(filters.startDate || '')}
                        onChange={(val) => handleFilterChange({ target: { name: 'startDate', value: val } } as any)}
                    />
                </div>
                <div className="flex flex-col gap-[0.2rem]">
                    <span className="text-xs font-medium text-text-secondary">{t.filter.endDate}</span>
                    <DateInput
                        name="endDate"
                        value={String(filters.endDate || '')}
                        onChange={(val) => handleFilterChange({ target: { name: 'endDate', value: val } } as any)}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2.5">
                <NumericFormat
                    className={filterFieldClass}
                    placeholder={t.filter.minAmount}
                    value={filters.minAmount || ''}
                    onValueChange={handleAmountChange('minAmount')}
                    thousandSeparator={currencyConfig.thousandSeparator}
                    decimalSeparator={currencyConfig.decimalSeparator}
                    prefix={currencyConfig.prefix}
                    decimalScale={2}
                    allowNegative={false}
                />
                <NumericFormat
                    className={filterFieldClass}
                    placeholder={t.filter.maxAmount}
                    value={filters.maxAmount || ''}
                    onValueChange={handleAmountChange('maxAmount')}
                    thousandSeparator={currencyConfig.thousandSeparator}
                    decimalSeparator={currencyConfig.decimalSeparator}
                    prefix={currencyConfig.prefix}
                    decimalScale={2}
                    allowNegative={false}
                />
            </div>

            <div className="flex items-center gap-4 flex-wrap min-[900px]:col-span-full">
                <label className="flex items-center gap-2 text-[0.9rem] cursor-pointer whitespace-nowrap text-text-primary">
                    <input
                        type="checkbox"
                        className="w-[1.1rem] h-[1.1rem] cursor-pointer accent-primary"
                        checked={filters.isFixed === 'true'}
                        onChange={(e) => handleFilterChange({
                            target: { name: 'isFixed', value: e.target.checked ? 'true' : '' },
                        } as React.ChangeEvent<HTMLInputElement>)}
                    />
                    {t.filter.fixedOnly}
                </label>
                <button
                    className="bg-transparent text-primary border border-primary py-2 px-4 text-[0.85rem] cursor-pointer rounded-lg transition-all duration-200 whitespace-nowrap font-[inherit] hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={resetFilters}
                >
                    {t.filter.resetFilters}
                </button>
            </div>
        </div>
    );

    return isMobile ? (
        <div>
            <div className="flex justify-end gap-4 mb-8">
                <button
                    className="bg-transparent border border-primary h-8 w-8 rounded-lg text-primary"
                    onClick={() => setShowFilters(true)}
                >
                    <TfiFilter />
                </button>

                {showFilters && (
                    <button
                        className="bg-transparent border border-primary h-8 w-8 rounded-lg text-primary"
                        onClick={() => setShowFilters(false)}
                    >
                        <RiChatDeleteLine />
                    </button>
                )}
            </div>
            {showFilters && filterContent()}
        </div>
    ) : (
        filterContent()
    );
};
