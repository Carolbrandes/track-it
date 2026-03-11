'use client';

import { useState } from 'react';
import {
    FiAlertTriangle, FiBarChart2, FiCheckCircle, FiChevronDown, FiCpu,
    FiDollarSign, FiEye, FiRefreshCw, FiTarget,
    FiTrendingUp, FiZap,
} from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { generateFinancialInsights } from '@/app/actions/generateInsights';
import { useTranslation } from '@/app/i18n/LanguageContext';
import * as S from '../styles';

const INSIGHTS_STALE_MS = 3 * 60 * 60 * 1000;

function getInsightsErrorMessage(
    errorCode: string | undefined,
    insights: { noTransactions: string; rateLimitError: string; timeoutError: string; genericError: string }
): string {
    const err = errorCode ?? '';
    const isTimeout = err.includes('timed out') || err.includes('timeout') || err === 'REQUEST_TIMEOUT';
    const errorMap: Record<string, string> = {
        NO_TRANSACTIONS: insights.noTransactions,
        RATE_LIMIT: insights.rateLimitError,
    };
    return isTimeout ? insights.timeoutError : (errorMap[err] || insights.genericError);
}

export default function AiInsightsSection() {
    const { t, locale } = useTranslation();
    const insights = t.insights;
    const [isExpanded, setIsExpanded] = useState(false);

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ['insights', locale],
        queryFn: async () => {
            const result = await generateFinancialInsights(locale);
            if (!result.success) throw new Error(result.error ?? '');
            if (!result.data) throw new Error(insights.genericError);
            return result.data;
        },
        staleTime: INSIGHTS_STALE_MS,
        gcTime: INSIGHTS_STALE_MS,
        enabled: false,
    });

    const loading = isLoading || isRefetching;
    let errorMessage: string | null = null;
    if (isError && error instanceof Error) {
        errorMessage = getInsightsErrorMessage(error.message, insights);
    }

    let localeForNumber = 'en-US';
    if (locale === 'pt') localeForNumber = 'pt-BR';
    else if (locale === 'es') localeForNumber = 'es-ES';
    const formatCurrency = (value: number) => {
        return value.toLocaleString(localeForNumber, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const handleToggle = () => {
        if (!isExpanded && !data && !isLoading) {
            refetch();
        }
        setIsExpanded(prev => !prev);
    };

    const handleRefresh = (e: React.MouseEvent) => {
        e.stopPropagation();
        refetch();
    };

    return (
        <S.InsightsPanel>
            <S.InsightsPanelHeader onClick={handleToggle} role="button" aria-expanded={isExpanded}>
                <S.InsightsSectionTitle>
                    <FiCpu size={20} />
                    {insights.title}
                </S.InsightsSectionTitle>
                <S.InsightsPanelActions>
                    {isExpanded && (
                        <S.RefreshButton
                            onClick={handleRefresh}
                            disabled={loading}
                            title={insights.generateButton}
                        >
                            <FiRefreshCw size={16} className={loading ? 'spinning' : ''} />
                        </S.RefreshButton>
                    )}
                    <S.InsightsChevron $isOpen={isExpanded}>
                        <FiChevronDown size={18} />
                    </S.InsightsChevron>
                </S.InsightsPanelActions>
            </S.InsightsPanelHeader>

            {isExpanded && (
                <>
                    {loading && (
                        <S.InsightsGrid>
                            <S.SkeletonCard />
                            <S.SkeletonCard />
                            <S.SkeletonCard />
                            <S.SkeletonCard />
                        </S.InsightsGrid>
                    )}

                    {errorMessage && !loading && (
                        <S.ErrorCard>
                            <S.ErrorText>{errorMessage}</S.ErrorText>
                        </S.ErrorCard>
                    )}

                    {data && !loading && (
                        <S.InsightsGrid>
                            <S.InsightCard>
                                <S.InsightCardTitle>
                                    <FiBarChart2 size={16} />
                                    {insights.summaryTitle}
                                </S.InsightCardTitle>
                                <S.InsightText>{data.summary}</S.InsightText>
                            </S.InsightCard>

                            {data.anomalies.length > 0 && (
                                <S.InsightCard>
                                    <S.InsightCardTitle>
                                        <FiAlertTriangle size={16} />
                                        {insights.anomaliesTitle}
                                    </S.InsightCardTitle>
                                    <S.AnomalyList>
                                        {data.anomalies.map((anomaly) => (
                                            <S.AnomalyItem key={anomaly}>{anomaly}</S.AnomalyItem>
                                        ))}
                                    </S.AnomalyList>
                                </S.InsightCard>
                            )}

                            <S.InsightCard>
                                <S.InsightCardTitle>
                                    <FiEye size={16} />
                                    {insights.ghostExpensesTitle}
                                </S.InsightCardTitle>
                                {data.ghostExpenses && data.ghostExpenses.length > 0 ? (
                                    <S.GhostList>
                                        {data.ghostExpenses.map((ghost) => (
                                            <S.GhostItem key={ghost.description}>
                                                <S.GhostItemHeader>
                                                    <S.GhostItemName>{ghost.description}</S.GhostItemName>
                                                    <S.GhostItemAmount>{formatCurrency(ghost.amount)}</S.GhostItemAmount>
                                                </S.GhostItemHeader>
                                                <S.GhostItemMeta>
                                                    {insights.ghostMonths.replace('{months}', String(ghost.monthsRepeated))}
                                                </S.GhostItemMeta>
                                                <S.GhostItemSuggestion>{ghost.suggestion}</S.GhostItemSuggestion>
                                            </S.GhostItem>
                                        ))}
                                    </S.GhostList>
                                ) : (
                                    <S.GhostEmptyText>
                                        <FiCheckCircle size={14} />
                                        {insights.ghostExpensesEmpty}
                                    </S.GhostEmptyText>
                                )}
                            </S.InsightCard>

                            {data.cashFlowForecast && (
                                <S.InsightCard>
                                    <S.InsightCardTitle>
                                        <FiDollarSign size={16} />
                                        {insights.cashFlowTitle}
                                    </S.InsightCardTitle>
                                    <S.ForecastGrid>
                                        <S.ForecastRow>
                                            <S.ForecastLabel>{insights.cashFlowEndOfMonth}</S.ForecastLabel>
                                            <S.ForecastValue $positive={data.cashFlowForecast.endOfMonth >= 0}>
                                                {formatCurrency(data.cashFlowForecast.endOfMonth)}
                                            </S.ForecastValue>
                                        </S.ForecastRow>
                                        <S.ForecastRow>
                                            <S.ForecastLabel>{insights.cashFlowNext90Days}</S.ForecastLabel>
                                            <S.ForecastValue $positive={data.cashFlowForecast.next90Days >= 0}>
                                                {formatCurrency(data.cashFlowForecast.next90Days)}
                                            </S.ForecastValue>
                                        </S.ForecastRow>
                                    </S.ForecastGrid>
                                    <S.ForecastNote>
                                        <strong>{insights.cashFlowInstallment}:</strong>{' '}
                                        {data.cashFlowForecast.canAffordInstallment}
                                    </S.ForecastNote>
                                </S.InsightCard>
                            )}

                            {data.categoryBreakdowns.length > 0 && (
                                <S.InsightCard>
                                    <S.InsightCardTitle>
                                        <FiTrendingUp size={16} />
                                        {insights.categoryComparisonTitle}
                                    </S.InsightCardTitle>
                                    <S.CategoryTable>
                                        <S.InsightTable>
                                            <thead>
                                                <tr>
                                                    <th>{insights.tableCategory}</th>
                                                    <th>{insights.tableCurrentMonth}</th>
                                                    <th>{insights.tablePreviousAvg}</th>
                                                    <th>{insights.tableChange}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.categoryBreakdowns.map((cat) => (
                                                    <tr key={cat.category}>
                                                        <td>{cat.category}</td>
                                                        <td>{cat.currentMonth.toFixed(2)}</td>
                                                        <td>{cat.previousAverage.toFixed(2)}</td>
                                                        <td>
                                                            <S.PercentBadge $isPositive={cat.percentChange <= 0}>
                                                                {cat.percentChange > 0 ? '+' : ''}{cat.percentChange.toFixed(1)}%
                                                            </S.PercentBadge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </S.InsightTable>
                                    </S.CategoryTable>
                                </S.InsightCard>
                            )}

                            <S.InsightCard>
                                <S.InsightCardTitle>
                                    <FiTarget size={16} />
                                    {insights.savingsProjectionTitle}
                                </S.InsightCardTitle>
                                <S.InsightText>{data.savingsProjection}</S.InsightText>
                            </S.InsightCard>

                            <S.MotivationalCard>
                                <S.InsightCardTitle>
                                    <FiZap size={16} />
                                    {insights.motivationalTitle}
                                </S.InsightCardTitle>
                                <S.MotivationalText>{data.motivationalTip}</S.MotivationalText>
                            </S.MotivationalCard>
                        </S.InsightsGrid>
                    )}
                </>
            )}
        </S.InsightsPanel>
    );
}
