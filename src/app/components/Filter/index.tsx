'use client';

import React, { useState } from 'react';
import { RiChatDeleteLine } from "react-icons/ri";
import { TfiFilter } from "react-icons/tfi";
import { Category } from '../../hooks/useCategories';
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
}

interface FilterProps {
    filters: IFilter;
    categories: Category[];
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    resetFilters: () => void;
}

export const Filter = ({ filters, categories = [], handleFilterChange, resetFilters }: FilterProps) => {
    const { isMobile } = useDeviceDetect();
    const [showFilters, setShowFilters] = useState(false);
    const { t } = useTranslation();

    const filterContent = () => (
        <S.FilterForm>
            <S.FilterGroup>
                <S.FilterInput
                    type="text"
                    name="description"
                    placeholder={t.filter.description}
                    value={String(filters.description) || ''}
                    onChange={handleFilterChange}
                />
            </S.FilterGroup>

            <S.FilterGroup>
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
            </S.FilterGroup>

            <S.FilterGroup>
                <S.FilterSelect
                    name="type"
                    value={filters.type || ''}
                    onChange={handleFilterChange}
                >
                    <option value="">{t.filter.allTypes}</option>
                    <option value="income">{t.filter.income}</option>
                    <option value="expense">{t.filter.expense}</option>
                </S.FilterSelect>
            </S.FilterGroup>

            <S.FilterGroup>
                <S.FilterInput
                    type="number"
                    name="minAmount"
                    placeholder={t.filter.minAmount}
                    value={filters.minAmount || ''}
                    onChange={handleFilterChange}
                />
                <S.FilterInput
                    type="number"
                    name="maxAmount"
                    placeholder={t.filter.maxAmount}
                    value={filters.maxAmount || ''}
                    onChange={handleFilterChange}
                />
            </S.FilterGroup>

            <S.FilterGroup>
                <S.FilterInput
                    type="date"
                    name="startDate"
                    placeholder="Start Date"
                    value={filters.startDate || ''}
                    onChange={handleFilterChange}
                />
                <S.FilterInput
                    type="date"
                    name="endDate"
                    placeholder="End Date"
                    value={filters.endDate || ''}
                    onChange={handleFilterChange}
                />
                <S.ResetButton onClick={resetFilters}>{t.filter.resetFilters}</S.ResetButton>
            </S.FilterGroup>
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