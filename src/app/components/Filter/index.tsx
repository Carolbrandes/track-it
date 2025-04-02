'use client'

import * as S from './styles';


interface FilterProps {
    filters: any
    categories: any
    handleFilterChange: (e: any) => void
    resetFilters: () => void
}

export const Filter = ({ filters, categories, handleFilterChange, resetFilters }: FilterProps) => {
    return (
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
    );
};