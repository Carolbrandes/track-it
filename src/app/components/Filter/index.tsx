'use client'

import React, { useState } from 'react';
import { RiChatDeleteLine } from "react-icons/ri";
import { TfiFilter } from "react-icons/tfi";
import { useDeviceDetect } from '../../hooks/useDeviceDetect';

import { Category } from '../../hooks/useCategories';
import * as S from './styles';

interface IFilter {
    description?: { $regex: string; $options: string } | string;
    category?: string | null;
    type?: string | null;
    amount?: { $gte?: number; $lte?: number } | string | null;
    date?: { $gte?: Date; $lte?: Date } | Date;
    userId?: string | null;
}

interface FilterProps {
    filters: IFilter
    categories: Category
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    resetFilters: () => void
}

export const Filter = ({ filters, categories, handleFilterChange, resetFilters }: FilterProps) => {
    const { isMobile } = useDeviceDetect();
    const [showFilters, setShowFilters] = useState(false)

    const filterContent = () => (
        <S.FilterForm>
            <S.FilterGroup>
                <S.FilterInput
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={filters.description}
                    onChange={handleFilterChange}
                />
            </S.FilterGroup>

            <S.FilterGroup>
                <S.FilterSelect
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                >
                    <option value="">All Categories</option>
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
                    value={filters.type}
                    onChange={handleFilterChange}
                >
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </S.FilterSelect>
            </S.FilterGroup>

            <S.FilterGroup>
                <S.FilterInput
                    type="number"
                    name="minAmount"
                    placeholder="Min Amount"
                    value={filters.minAmount}
                    onChange={handleFilterChange}
                />
                <S.FilterInput
                    type="number"
                    name="maxAmount"
                    placeholder="Max Amount"
                    value={filters.maxAmount}
                    onChange={handleFilterChange}
                />
            </S.FilterGroup>

            <S.FilterGroup>
                <S.FilterInput
                    type="date"
                    name="startDate"
                    placeholder="Start Date"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                />
                <S.FilterInput
                    type="date"
                    name="endDate"
                    placeholder="End Date"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                />
                {/* Reset Filters Button */}
                <S.ResetButton onClick={resetFilters}>Reset Filters</S.ResetButton>
            </S.FilterGroup>


        </S.FilterForm>
    )

    return isMobile ? (<S.FilterContainer>
        <div className="filterButtonContainer">
            <button onClick={() => setShowFilters(true)}>
                <TfiFilter />
            </button>

            {showFilters && <button onClick={() => setShowFilters(false)}><RiChatDeleteLine />
            </button>}
        </div>

        {
            showFilters && filterContent()
        }

    </S.FilterContainer>)
        : filterContent()
};