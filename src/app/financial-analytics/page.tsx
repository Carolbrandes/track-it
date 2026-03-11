'use client';

import { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { useCategories } from '../hooks/useCategories';
import { useUserData } from '../hooks/useUserData';
import ComparisonTab from './components/ComparisonTab';
import MonthAnalysisTab from './components/MonthAnalysisTab';
import SummaryTab from './components/SummaryTab';
import * as S from './styles';

type ActiveTab = 'summary' | 'analysis' | 'comparison';

export default function FinancialAnalyticsPage() {
    const { t } = useTranslation();
    const { data: userData } = useUserData();
    const { categories = [] } = useCategories(userData?._id);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedCategory, setSelectedCategory] = useState('');

    const months = t.analytics.months.map((name, i) => ({ value: i + 1, name }));
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    const categoryFilter = selectedCategory || undefined;

    return (
        <S.PageContainer>
            <S.Title>{t.analytics.title}</S.Title>

            <S.TabBar>
                <S.TabButton $active={activeTab === 'summary'} onClick={() => setActiveTab('summary')}>
                    {t.analytics.tabSummary}
                </S.TabButton>
                <S.TabButton $active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')}>
                    {t.analytics.tabAnalysis}
                </S.TabButton>
                <S.TabButton $active={activeTab === 'comparison'} onClick={() => setActiveTab('comparison')}>
                    {t.analytics.tabComparison}
                </S.TabButton>
            </S.TabBar>

            {activeTab !== 'comparison' && (
                <S.FilterContainer>
                    <S.FilterGroup>
                        <S.FilterLabel>{t.analytics.month}</S.FilterLabel>
                        <S.FilterSelect
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number.parseInt(e.target.value))}
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
                            onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
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
            )}

            {activeTab === 'summary' && (
                <SummaryTab
                    month={selectedMonth}
                    year={selectedYear}
                    category={categoryFilter}
                />
            )}

            {activeTab === 'analysis' && (
                <MonthAnalysisTab
                    month={selectedMonth}
                    year={selectedYear}
                    category={categoryFilter}
                />
            )}

            {activeTab === 'comparison' && (
                <ComparisonTab
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    months={months}
                    years={years}
                />
            )}
        </S.PageContainer>
    );
}
