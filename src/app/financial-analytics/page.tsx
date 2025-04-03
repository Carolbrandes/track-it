'use client';

import { useState } from 'react';
import FinancialPieChart from './components/FinancialPieChart';
import * as S from './styles';

export default function FinancialAnalyticsPage() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const months = [
        { value: 1, name: 'January' },
        { value: 2, name: 'February' },
        { value: 3, name: 'March' },
        { value: 4, name: 'April' },
        { value: 5, name: 'May' },
        { value: 6, name: 'June' },
        { value: 7, name: 'July' },
        { value: 8, name: 'August' },
        { value: 9, name: 'September' },
        { value: 10, name: 'October' },
        { value: 11, name: 'November' },
        { value: 12, name: 'December' }
    ];

    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    return (
        <S.PageContainer>
            <S.Title>Financial Analytics</S.Title>

            <S.FilterContainer>
                <S.FilterGroup>
                    <S.FilterLabel>Month</S.FilterLabel>
                    <S.FilterSelect
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    >
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.name}
                            </option>
                        ))}
                    </S.FilterSelect>
                </S.FilterGroup>

                <S.FilterGroup>
                    <S.FilterLabel>Year</S.FilterLabel>
                    <S.FilterSelect
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </S.FilterSelect>
                </S.FilterGroup>
            </S.FilterContainer>

            <FinancialPieChart month={selectedMonth} year={selectedYear} />
        </S.PageContainer>
    );
}