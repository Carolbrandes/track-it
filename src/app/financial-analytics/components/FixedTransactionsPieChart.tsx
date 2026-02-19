'use client';

import { ArcElement, Chart as ChartJS, ChartOptions, Legend, Title, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useTransactions } from '../../hooks/useTransactions';
import { useUserData } from '../../hooks/useUserData';
import { useTranslation } from '../../i18n/LanguageContext';
import * as S from '../styles';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const FixedTransactionsPieChart = ({ month, year }: { month: number; year: number }) => {
    const { t } = useTranslation();
    const { data: userData } = useUserData();
    const userId = userData?._id;
    const { transactions = [] } = useTransactions(userId, 1, 100) || {};

    const filteredTransactions = transactions.filter(txn => {
        if (!txn.date || !txn.is_fixed) return false;

        const txnDate = new Date(txn.date);
        const utcDate = new Date(Date.UTC(
            txnDate.getUTCFullYear(),
            txnDate.getUTCMonth(),
            txnDate.getUTCDate()
        ));

        return utcDate.getUTCMonth() + 1 === month && utcDate.getUTCFullYear() === year;
    });

    const expenseTotal = filteredTransactions
        .filter(txn => txn.type === 'expense')
        .reduce((sum, txn) => sum + (txn.amount || 0), 0);

    const incomeTotal = filteredTransactions
        .filter(txn => txn.type === 'income')
        .reduce((sum, txn) => sum + (txn.amount || 0), 0);

    const typeChartData = {
        labels: [t.analytics.income, t.analytics.expenses],
        datasets: [{
            data: [incomeTotal, expenseTotal],
            backgroundColor: ['#42A5F5', '#FF7043'],
            hoverOffset: 4,
        }],
    };

    const chartOptions: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw as number;
                        const total = incomeTotal + expenseTotal;
                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                    },
                },
            },
        },
    };

    const monthLabel = new Date(year, month - 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

    return (
        <S.ChartWrapperContainer>
            <S.ChartWrapper>
                <S.ChartTitle>{t.analytics.fixedIncomeVsExpenses}</S.ChartTitle>
                {filteredTransactions.length > 0 ? (
                    <>
                        <S.ChartContainer>
                            <Pie data={typeChartData} options={chartOptions} />
                        </S.ChartContainer>
                        <S.LegendContainer>
                            <S.LegendItem>
                                <S.ColorBox style={{ backgroundColor: '#42A5F5' }} />
                                {t.analytics.income}: ${incomeTotal.toFixed(2)} (
                                {incomeTotal + expenseTotal > 0
                                    ? Math.round((incomeTotal / (incomeTotal + expenseTotal)) * 100)
                                    : 0}%)
                            </S.LegendItem>
                            <S.LegendItem>
                                <S.ColorBox style={{ backgroundColor: '#FF7043' }} />
                                {t.analytics.expenses}: ${expenseTotal.toFixed(2)} (
                                {incomeTotal + expenseTotal > 0
                                    ? Math.round((expenseTotal / (incomeTotal + expenseTotal)) * 100)
                                    : 0}%)
                            </S.LegendItem>
                        </S.LegendContainer>
                    </>
                ) : (
                    <div>{t.analytics.noFixedTransactions} {monthLabel}</div>
                )}
            </S.ChartWrapper>
        </S.ChartWrapperContainer>
    );
};

export default FixedTransactionsPieChart;
