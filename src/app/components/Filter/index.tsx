'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { NumberFormatValues } from 'react-number-format';
import { RiChatDeleteLine } from "react-icons/ri";
import { TfiFilter } from "react-icons/tfi";
import { addMonths, endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { Category } from '../../hooks/useCategories';
import { useCurrency } from '../../hooks/useCurrency';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { useTranslation } from '../../i18n/LanguageContext';
import { DateInput } from '../DateInput';
import * as S from './styles';

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

    // Precompute expected date ranges for each quick filter button (stable per mount day)
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
        <S.FilterForm>
            <S.FilterColumn>
                <S.FilterInput
                    type="text"
                    name="description"
                    placeholder={t.filter.description}
                    value={String(filters.description) || ''}
                    onChange={handleFilterChange}
                />
                <S.FilterSelect
                    name="category"
                    value={filters.category || ''}
                    onChange={handleFilterChange}
                >
                    <option value="">{t.filter.allCategories}</option>
                    {categories.map(category => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </S.FilterSelect>
                <S.FilterSelect
                    name="type"
                    value={filters.type || ''}
                    onChange={handleFilterChange}
                >
                    <option value="">{t.filter.allTypes}</option>
                    <option value="income">{t.filter.income}</option>
                    <option value="expense">{t.filter.expense}</option>
                </S.FilterSelect>
                <S.QuickFilterRow>
                    <S.QuickFilterButton type="button" $active={isActive('nextMonth')} onClick={applyNextMonthFilter}>
                        {t.filter.nextMonth}
                    </S.QuickFilterButton>
                    <S.QuickFilterButton type="button" $active={isActive('thisMonth')} onClick={() => applyQuickDateFilter(0)}>
                        {t.filter.thisMonth}
                    </S.QuickFilterButton>
                    <S.QuickFilterButton type="button" $active={isActive('lastMonth')} onClick={applyLastMonthFilter}>
                        {t.filter.lastMonth}
                    </S.QuickFilterButton>
                    <S.QuickFilterButton type="button" $active={isActive('last3Months')} onClick={() => applyQuickDateFilter(2)}>
                        {t.filter.last3Months}
                    </S.QuickFilterButton>
                    <S.QuickFilterButton type="button" $active={isActive('last6Months')} onClick={() => applyQuickDateFilter(5)}>
                        {t.filter.last6Months}
                    </S.QuickFilterButton>
                    <S.QuickFilterButton type="button" $active={isActive('lastYear')} onClick={() => applyQuickDateFilter(11)}>
                        {t.filter.lastYear}
                    </S.QuickFilterButton>
                </S.QuickFilterRow>
                <S.DateFieldWrapper>
                    <S.DateLabel>{t.filter.startDate}</S.DateLabel>
                    <DateInput
                        name="startDate"
                        value={String(filters.startDate || '')}
                        onChange={(val) => handleFilterChange({ target: { name: 'startDate', value: val } } as any)}
                    />
                </S.DateFieldWrapper>
                <S.DateFieldWrapper>
                    <S.DateLabel>{t.filter.endDate}</S.DateLabel>
                    <DateInput
                        name="endDate"
                        value={String(filters.endDate || '')}
                        onChange={(val) => handleFilterChange({ target: { name: 'endDate', value: val } } as any)}
                    />
                </S.DateFieldWrapper>
            </S.FilterColumn>

            <S.FilterColumn>
                <S.FilterNumericFormat
                    placeholder={t.filter.minAmount}
                    value={filters.minAmount || ''}
                    onValueChange={handleAmountChange('minAmount')}
                    thousandSeparator={currencyConfig.thousandSeparator}
                    decimalSeparator={currencyConfig.decimalSeparator}
                    prefix={currencyConfig.prefix}
                    decimalScale={2}
                    allowNegative={false}
                />
                <S.FilterNumericFormat
                    placeholder={t.filter.maxAmount}
                    value={filters.maxAmount || ''}
                    onValueChange={handleAmountChange('maxAmount')}
                    thousandSeparator={currencyConfig.thousandSeparator}
                    decimalSeparator={currencyConfig.decimalSeparator}
                    prefix={currencyConfig.prefix}
                    decimalScale={2}
                    allowNegative={false}
                />
            </S.FilterColumn>

            <S.FilterBottomRow>
                <S.CheckboxLabel>
                    <input
                        type="checkbox"
                        checked={filters.isFixed === 'true'}
                        onChange={(e) => handleFilterChange({
                            target: { name: 'isFixed', value: e.target.checked ? 'true' : '' },
                        } as React.ChangeEvent<HTMLInputElement>)}
                    />
                    {t.filter.fixedOnly}
                </S.CheckboxLabel>
                <S.ResetButton onClick={resetFilters}>{t.filter.resetFilters}</S.ResetButton>
            </S.FilterBottomRow>
        </S.FilterForm>
    );

    return isMobile ? (
        <S.FilterContainer>
            <div className="filterButtonContainer">
                <button onClick={() => setShowFilters(true)}>
                    <TfiFilter />
                </button>

                {showFilters && (
                    <button onClick={() => setShowFilters(false)}>
                        <RiChatDeleteLine />
                    </button>
                )}
            </div>
            {showFilters && filterContent()}
        </S.FilterContainer>
    ) : (
        filterContent()
    );
};
