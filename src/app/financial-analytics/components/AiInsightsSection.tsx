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
import { cn } from '@/app/lib/cn';

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
        enabled: true,
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
        setIsExpanded(prev => !prev);
    };

    const handleRefresh = (e: React.MouseEvent) => {
        e.stopPropagation();
        refetch();
    };

    return (
        <div className="w-full bg-surface border border-gray-300 rounded-xl px-5 py-4 mb-6">
            <div
                className="flex items-center justify-between cursor-pointer select-none hover:opacity-85"
                onClick={handleToggle}
                role="button"
                aria-expanded={isExpanded}
            >
                <h2 className="text-[1.05rem] font-semibold text-text-primary flex items-center gap-2 m-0">
                    <FiCpu size={20} />
                    {insights.title}
                </h2>
                <div className="flex items-center gap-2">
                    {isExpanded && (
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            title={insights.generateButton}
                            className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-lg bg-surface cursor-pointer text-text-primary transition-all duration-200 hover:enabled:bg-primary hover:enabled:text-white hover:enabled:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiRefreshCw size={16} className={cn(loading && 'animate-spin')} />
                        </button>
                    )}
                    <span
                        className={cn(
                            'flex items-center text-text-secondary transition-transform duration-[250ms] ease-in-out leading-none',
                            isExpanded && 'rotate-180'
                        )}
                    >
                        <FiChevronDown size={18} />
                    </span>
                </div>
            </div>

            {isExpanded && (
                <>
                    {loading && (
                        <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-2 xl:grid-cols-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-gray-200 rounded-xl p-4 h-[72px] animate-pulse" />
                            ))}
                        </div>
                    )}

                    {errorMessage && !loading && (
                        <div className="bg-surface rounded-xl p-4 border border-gray-300 border-l-[3px] border-l-danger text-text-primary">
                            <p className="text-danger text-[0.85rem]">{errorMessage}</p>
                        </div>
                    )}

                    {data && !loading && (
                        <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-2 xl:grid-cols-3">
                            <div className="bg-surface rounded-xl px-4 py-4 border border-gray-300 text-text-primary">
                                <h3 className="text-[0.9rem] font-semibold mb-2 flex items-center gap-1.5">
                                    <FiBarChart2 size={16} />
                                    {insights.summaryTitle}
                                </h3>
                                <p className="text-[0.85rem] leading-relaxed">{data.summary}</p>
                            </div>

                            {data.anomalies.length > 0 && (
                                <div className="bg-surface rounded-xl px-4 py-4 border border-gray-300 text-text-primary">
                                    <h3 className="text-[0.9rem] font-semibold mb-2 flex items-center gap-1.5">
                                        <FiAlertTriangle size={16} />
                                        {insights.anomaliesTitle}
                                    </h3>
                                    <ul className="list-none p-0 flex flex-col gap-1.5">
                                        {data.anomalies.map((anomaly) => (
                                            <li
                                                key={anomaly}
                                                className="px-3 py-2 bg-danger/[0.07] border-l-[3px] border-l-danger rounded-r-lg text-[0.82rem] leading-[1.45]"
                                            >
                                                {anomaly}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="bg-surface rounded-xl px-4 py-4 border border-gray-300 text-text-primary">
                                <h3 className="text-[0.9rem] font-semibold mb-2 flex items-center gap-1.5">
                                    <FiEye size={16} />
                                    {insights.ghostExpensesTitle}
                                </h3>
                                {data.ghostExpenses && data.ghostExpenses.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {data.ghostExpenses.map((ghost) => (
                                            <div
                                                key={ghost.description}
                                                className="flex flex-col gap-1 px-3 py-2.5 bg-warning/[0.05] border-l-[3px] border-l-warning rounded-r-lg"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-[0.84rem]">{ghost.description}</span>
                                                    <span className="font-bold text-[0.84rem] text-danger">{formatCurrency(ghost.amount)}</span>
                                                </div>
                                                <span className="text-[0.75rem] text-text-secondary">
                                                    {insights.ghostMonths.replace('{months}', String(ghost.monthsRepeated))}
                                                </span>
                                                <span className="text-[0.8rem] italic text-text-primary leading-[1.4]">{ghost.suggestion}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[0.84rem] text-success flex items-center gap-1.5">
                                        <FiCheckCircle size={14} />
                                        {insights.ghostExpensesEmpty}
                                    </p>
                                )}
                            </div>

                            {data.cashFlowForecast && (
                                <div className="bg-surface rounded-xl px-4 py-4 border border-gray-300 text-text-primary">
                                    <h3 className="text-[0.9rem] font-semibold mb-2 flex items-center gap-1.5">
                                        <FiDollarSign size={16} />
                                        {insights.cashFlowTitle}
                                    </h3>
                                    <div className="flex flex-col gap-2.5">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-300 last:border-b-0">
                                            <span className="text-[0.82rem] text-text-secondary">{insights.cashFlowEndOfMonth}</span>
                                            <span className={cn(
                                                'text-[0.9rem] font-bold',
                                                data.cashFlowForecast.endOfMonth >= 0 ? 'text-success' : 'text-danger'
                                            )}>
                                                {formatCurrency(data.cashFlowForecast.endOfMonth)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-[0.82rem] text-text-secondary">{insights.cashFlowNext90Days}</span>
                                            <span className={cn(
                                                'text-[0.9rem] font-bold',
                                                data.cashFlowForecast.next90Days >= 0 ? 'text-success' : 'text-danger'
                                            )}>
                                                {formatCurrency(data.cashFlowForecast.next90Days)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[0.82rem] leading-normal px-2.5 py-2 bg-primary/[0.05] rounded-lg mt-1">
                                        <strong>{insights.cashFlowInstallment}:</strong>{' '}
                                        {data.cashFlowForecast.canAffordInstallment}
                                    </p>
                                </div>
                            )}

                            {data.categoryBreakdowns.length > 0 && (
                                <div className="bg-surface rounded-xl px-4 py-4 border border-gray-300 text-text-primary">
                                    <h3 className="text-[0.9rem] font-semibold mb-2 flex items-center gap-1.5">
                                        <FiTrendingUp size={16} />
                                        {insights.categoryComparisonTitle}
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-[0.82rem] [&_th]:text-left [&_th]:px-2 [&_th]:py-2 [&_th]:border-b [&_th]:border-gray-300 [&_th]:font-semibold [&_th]:text-[0.72rem] [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-text-secondary [&_td]:text-left [&_td]:px-2 [&_td]:py-2 [&_td]:border-b [&_td]:border-gray-300">
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
                                                            <span className={cn(
                                                                'inline-block px-1.5 py-0.5 rounded-md text-[0.75rem] font-semibold',
                                                                cat.percentChange <= 0
                                                                    ? 'bg-success/[0.13] text-success'
                                                                    : 'bg-danger/[0.13] text-danger'
                                                            )}>
                                                                {cat.percentChange > 0 ? '+' : ''}{cat.percentChange.toFixed(1)}%
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="bg-surface rounded-xl px-4 py-4 border border-gray-300 text-text-primary">
                                <h3 className="text-[0.9rem] font-semibold mb-2 flex items-center gap-1.5">
                                    <FiTarget size={16} />
                                    {insights.savingsProjectionTitle}
                                </h3>
                                <p className="text-[0.85rem] leading-relaxed">{data.savingsProjection}</p>
                            </div>

                            <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-xl px-4 py-4 border border-transparent">
                                <h3 className="text-[0.9rem] font-semibold mb-2 flex items-center gap-1.5">
                                    <FiZap size={16} />
                                    {insights.motivationalTitle}
                                </h3>
                                <p className="text-[0.88rem] leading-relaxed font-medium">{data.motivationalTip}</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
