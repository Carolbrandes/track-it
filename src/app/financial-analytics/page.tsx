'use client';

import { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { useCategories } from '../hooks/useCategories';
import { useUserData } from '../hooks/useUserData';
import AiInsightsSection from './components/AiInsightsSection';
import AnalyticsSummary from './components/AnalyticsSummary';
import FinancialPieChart from './components/FinancialPieChart';
import FixedTransactionsPieChart from './components/FixedTransactionsPieChart';
import * as S from './styles';

export default function FinancialAnalyticsPage() {
    const { t } = useTranslation();
    const { data: userData } = useUserData();
    const { categories = [] } = useCategories(userData?._id);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedCategory, setSelectedCategory] = useState('');

    const months = t.analytics.months.map((name, i) => ({ value: i + 1, name }));

    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const categoryFilter = selectedCategory || undefined;

    return (
        <S.PageContainer>
            <S.Title>{t.analytics.title}</S.Title>

            <S.FilterContainer>
                <S.FilterGroup>
                    <S.FilterLabel>{t.analytics.month}</S.FilterLabel>
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
                    <S.FilterLabel>{t.analytics.year}</S.FilterLabel>
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

                <S.FilterGroup>
                    <S.FilterLabel>{t.filter.allCategories}</S.FilterLabel>
                    <S.FilterSelect
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">{t.filter.allCategories}</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </S.FilterSelect>
                </S.FilterGroup>
            </S.FilterContainer>

            <S.AnalyticsLayout>
                <AiInsightsSection />

                <S.ChartsColumn>
                    <S.ChartSection>
                        <S.ChartSectionTitle>{t.analytics.summaryTitle}</S.ChartSectionTitle>
                        <AnalyticsSummary month={selectedMonth} year={selectedYear} category={categoryFilter} />
                    </S.ChartSection>

                    <S.ChartSection>
                        <S.ChartSectionTitle>{t.analytics.generalChart}</S.ChartSectionTitle>
                        <FinancialPieChart month={selectedMonth} year={selectedYear} category={categoryFilter} />
                    </S.ChartSection>

                    <S.ChartSection>
                        <S.ChartSectionTitle>{t.analytics.fixedChart}</S.ChartSectionTitle>
                        <FixedTransactionsPieChart month={selectedMonth} year={selectedYear} category={categoryFilter} />
                    </S.ChartSection>
                </S.ChartsColumn>
            </S.AnalyticsLayout>
        </S.PageContainer>
    );
}
