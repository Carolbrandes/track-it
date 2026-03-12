'use client';

import { useState } from 'react';
import { cn } from '@/app/lib/cn';
import { useTranslation } from '../i18n/LanguageContext';
import { useCategories } from '../hooks/useCategories';
import { useUserData } from '../hooks/useUserData';
import ComparisonTab from './components/ComparisonTab';
import MonthAnalysisTab from './components/MonthAnalysisTab';
import SummaryTab from './components/SummaryTab';

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
        <div className="p-4 w-full min-w-0 overflow-x-hidden flex-1 md:p-8 md:max-w-[1400px] md:mx-auto">
            <h1 className="text-[1.75rem] font-bold text-text-primary mb-5">{t.analytics.title}</h1>

            <div className="flex gap-1 border-b-2 border-gray-300 mb-8">
                {(['summary', 'analysis', 'comparison'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'px-5 py-2.5 text-[0.9rem] font-medium bg-transparent border-none border-b-2 -mb-[2px] cursor-pointer transition-colors duration-150 whitespace-nowrap',
                            activeTab === tab
                                ? 'font-bold border-primary text-primary'
                                : 'border-transparent text-text-secondary hover:text-primary'
                        )}
                    >
                        {tab === 'summary' && t.analytics.tabSummary}
                        {tab === 'analysis' && t.analytics.tabAnalysis}
                        {tab === 'comparison' && t.analytics.tabComparison}
                    </button>
                ))}
            </div>

            {activeTab !== 'comparison' && (
                <div className="flex flex-wrap gap-4 mb-8 max-w-[600px]">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[0.8rem] font-semibold text-text-secondary uppercase tracking-wide">
                            {t.analytics.month}
                        </label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number.parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-[0.9rem] bg-surface text-text-primary font-[inherit] transition-colors duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13]"
                        >
                            {months.map((month) => (
                                <option key={month.value} value={month.value}>
                                    {month.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[0.8rem] font-semibold text-text-secondary uppercase tracking-wide">
                            {t.analytics.year}
                        </label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-[0.9rem] bg-surface text-text-primary font-[inherit] transition-colors duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13]"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[0.8rem] font-semibold text-text-secondary uppercase tracking-wide">
                            {t.filter.allCategories}
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-[0.9rem] bg-surface text-text-primary font-[inherit] transition-colors duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13]"
                        >
                            <option value="">{t.filter.allCategories}</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
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
        </div>
    );
}
