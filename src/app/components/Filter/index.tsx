'use client';

import React, { useCallback, useState } from 'react';
import { NumberFormatValues } from 'react-number-format';
import { RiChatDeleteLine } from "react-icons/ri";
import { TfiFilter } from "react-icons/tfi";
import { Category } from '../../hooks/useCategories';
import { useCurrency } from '../../hooks/useCurrency';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { useTranslation } from '../../i18n/LanguageContext';
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
    fixedOnly?: boolean;
}

interface FilterProps {
    filters: IFilter;
    categories: Category[];
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onFixedOnlyChange: (checked: boolean) => void;
    resetFilters: () => void;
}

function getCurrencyConfig(code: string) {
    switch (code) {
        case 'BRL': return { prefix: 'R$ ', thousandSeparator: '.', decimalSeparator: ',' };
        case 'EUR': return { prefix: '€ ', thousandSeparator: '.', decimalSeparator: ',' };
        default:    return { prefix: '$ ', thousandSeparator: ',', decimalSeparator: '.' };
    }
}

export const Filter = ({ filters, categories = [], handleFilterChange, onFixedOnlyChange, resetFilters }: FilterProps) => {
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
                <S.DateFieldWrapper>
                    <S.DateLabel>{t.filter.startDate}</S.DateLabel>
                    <S.FilterDateInput
                        type="date"
                        name="startDate"
                        value={String(filters.startDate || '')}
                        onChange={handleFilterChange}
                    />
                </S.DateFieldWrapper>
                <S.DateFieldWrapper>
                    <S.DateLabel>{t.filter.endDate}</S.DateLabel>
                    <S.FilterDateInput
                        type="date"
                        name="endDate"
                        value={String(filters.endDate || '')}
                        onChange={handleFilterChange}
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
                        checked={filters.fixedOnly || false}
                        onChange={(e) => onFixedOnlyChange(e.target.checked)}
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
