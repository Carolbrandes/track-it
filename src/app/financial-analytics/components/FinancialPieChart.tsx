'use client';

import { ArcElement, Chart as ChartJS, ChartOptions, Legend, Title, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useTransactions } from '../../hooks/useTransactions';
import { useUserData } from '../../hooks/useUserData';
import * as S from '../styles';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const FinancialPieChart = ({ month, year }: { month: number, year: number }) => {
    const { data: userData } = useUserData();
    const userId = userData?._id;
    const { transactions = [] } = useTransactions(userId, 1, 100) || {};



    // Fixed timezone-aware date filtering
    const filteredTransactions = transactions.filter(txn => {
        if (!txn.date) {
            return false;
        }

        // Parse date in UTC to avoid timezone issues
        const txnDate = new Date(txn.date);
        const utcDate = new Date(Date.UTC(
            txnDate.getUTCFullYear(),
            txnDate.getUTCMonth(),
            txnDate.getUTCDate()
        ));

        const txnMonth = utcDate.getUTCMonth() + 1;
        const txnYear = utcDate.getUTCFullYear();



        return txnMonth === month && txnYear === year;
    });



    // Calculate totals by type
    const expenseTotal = filteredTransactions
        .filter(txn => txn.type === 'expense')
        .reduce((sum, txn) => sum + (txn.amount || 0), 0);

    const incomeTotal = filteredTransactions
        .filter(txn => txn.type === 'income')
        .reduce((sum, txn) => sum + (txn.amount || 0), 0);



    // Prepare chart data
    const typeChartData = {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [incomeTotal, expenseTotal],
            backgroundColor: ['#66BB6A', '#EF5350'],
            hoverOffset: 4,
        }],
    };

    const chartOptions: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw as number;
                        const total = incomeTotal + expenseTotal;
                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                    }
                }
            }
        },
    };

    return (
        <S.ChartWrapperContainer>
            <S.ChartWrapper>
                <S.ChartTitle>Income vs Expenses</S.ChartTitle>
                {filteredTransactions.length > 0 ? (
                    <>
                        <S.ChartContainer>
                            <Pie data={typeChartData} options={chartOptions} />
                        </S.ChartContainer>
                        <S.LegendContainer>
                            <S.LegendItem>
                                <S.ColorBox style={{ backgroundColor: '#66BB6A' }} />
                                Income: ${incomeTotal.toFixed(2)} (
                                {incomeTotal + expenseTotal > 0 ?
                                    Math.round((incomeTotal / (incomeTotal + expenseTotal)) * 100) :
                                    0
                                }%)
                            </S.LegendItem>
                            <S.LegendItem>
                                <S.ColorBox style={{ backgroundColor: '#EF5350' }} />
                                Expenses: ${expenseTotal.toFixed(2)} (
                                {incomeTotal + expenseTotal > 0 ?
                                    Math.round((expenseTotal / (incomeTotal + expenseTotal)) * 100) :
                                    0
                                }%)
                            </S.LegendItem>
                        </S.LegendContainer>
                    </>
                ) : (
                    <div>No transactions available for {new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                )}
            </S.ChartWrapper>
        </S.ChartWrapperContainer>
    );
};

export default FinancialPieChart;