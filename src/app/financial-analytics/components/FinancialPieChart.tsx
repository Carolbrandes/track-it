'use client';

import { ArcElement, Chart as ChartJS, ChartOptions, Legend, Title, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useCategories } from '../../hooks/useCategories';
import { useTransactions } from '../../hooks/useTransactions';
import { useUserData } from '../../hooks/useUserData';
import * as S from '../styles';

// Register necessary components from Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const FinancialPieChart = ({ month, year }: { month: string | number, year: string | number }) => {
    const { data: userData } = useUserData();
    const userId = userData?._id;
    const { transactions } = useTransactions(userId, 1, 100);
    const { categories } = useCategories(userId);

    // Filter transactions by selected month and year
    const filteredTransactions = transactions?.filter(txn => {
        if (!txn.date) return false;
        const txnDate = new Date(txn.date);
        return (
            txnDate.getMonth() + 1 === month &&
            txnDate.getFullYear() === year
        );
    }) || [];

    // Get categories actually used in transactions, grouped by type
    const getCategoriesByType = (type: 'expense' | 'income') => {
        // Get unique category IDs from transactions of this type
        const categoryIds = [...new Set(
            filteredTransactions
                .filter(txn => txn.type === type && txn.category)
                .map(txn => txn.category)
        )];

        // Return the full category objects that match these IDs
        return categories.filter(cat =>
            categoryIds.includes(cat._id)
        );
    };

    const expenseCategories = getCategoriesByType('expense');
    const incomeCategories = getCategoriesByType('income');

    // Prepare data - group transactions by category for each type
    const expenseData = expenseCategories.map(category =>
        filteredTransactions
            .filter(txn =>
                txn.type === 'expense' &&
                txn.category === category.name
            )
            .reduce((acc, txn) => acc + txn.amount, 0)
    );

    const incomeData = incomeCategories.map(category =>
        filteredTransactions
            .filter(txn =>
                txn.type === 'income' &&
                txn.category === category.name
            )
            .reduce((acc, txn) => acc + txn.amount, 0)
    );

    // Calculate totals
    const expenseTotal = expenseData.reduce((acc, val) => acc + val, 0);
    const incomeTotal = incomeData.reduce((acc, val) => acc + val, 0);

    // Prepare chart datasets
    const expenseChartData = {
        labels: expenseCategories.map(cat => cat.name),
        datasets: [{
            data: expenseData,
            backgroundColor: [
                '#FF7043', '#FFA726', '#EF5350',
                '#EC407A', '#AB47BC', '#7E57C2',
                '#5C6BC0', '#42A5F5', '#26C6DA'
            ],
            hoverOffset: 4,
        }],
    };

    const incomeChartData = {
        labels: incomeCategories.map(cat => cat.name),
        datasets: [{
            data: incomeData,
            backgroundColor: [
                '#66BB6A', '#81C784', '#4CAF50',
                '#26A69A', '#00897B', '#7E57C2',
                '#5C6BC0', '#42A5F5', '#26C6DA'
            ],
            hoverOffset: 4,
        }],
    };

    // Chart options
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
                        const value = Number(context.raw) || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100); // The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type
                        return `${label}: $${value} (${percentage}%)`;
                    }
                }
            }
        },
    };

    return (
        <S.ChartWrapperContainer>
            <S.ChartWrapper>
                <S.ChartTitle>Expenses by Category</S.ChartTitle>
                {expenseTotal > 0 ? (
                    <>
                        <S.ChartContainer>
                            <Pie data={expenseChartData} options={chartOptions} />
                        </S.ChartContainer>
                        <S.LegendContainer>
                            {expenseCategories.map((category, index) => (
                                <S.LegendItem key={category._id}>
                                    <S.ColorBox style={{
                                        backgroundColor: expenseChartData.datasets[0].backgroundColor[index]
                                    }} />
                                    {category.name}: ${expenseData[index]} (
                                    {expenseData[index] > 0 ?
                                        Math.round((expenseData[index] / expenseTotal) * 100) :
                                        0
                                    }%)
                                </S.LegendItem>
                            ))}
                        </S.LegendContainer>
                    </>
                ) : (
                    <div>No expense data available for {new Date(+year, +month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                )}
            </S.ChartWrapper>

            <S.ChartWrapper>
                <S.ChartTitle>Income by Category</S.ChartTitle>
                {incomeTotal > 0 ? (
                    <>
                        <S.ChartContainer>
                            <Pie data={incomeChartData} options={chartOptions} />
                        </S.ChartContainer>
                        <S.LegendContainer>
                            {incomeCategories.map((category, index) => (
                                <S.LegendItem key={category._id}>
                                    <S.ColorBox style={{
                                        backgroundColor: incomeChartData.datasets[0].backgroundColor[index]
                                    }} />
                                    {category.name}: ${incomeData[index]} (
                                    {incomeData[index] > 0 ?
                                        Math.round((incomeData[index] / incomeTotal) * 100) :
                                        0
                                    }%)
                                </S.LegendItem>
                            ))}
                        </S.LegendContainer>
                    </>
                ) : (
                    <div>No income data available for {new Date(+year, +month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                )}
            </S.ChartWrapper>
        </S.ChartWrapperContainer>
    );
};

export default FinancialPieChart;