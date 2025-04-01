'use client';

import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useCategories } from '../../hooks/useCategories';
import { useTransactions } from '../../hooks/useTransactions';
import { useUserData } from '../../hooks/useUserData';
import * as S from '../styles';

// Register necessary components from Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const FinancialPieChart = () => {
    const { data: userData } = useUserData();
    const userId = userData?.user?.id;
    const { transactions } = useTransactions(userId, 1, 100);
    const { categories } = useCategories(userId);

    console.log('Transactions:', transactions);
    console.log('Categories:', categories);

    // Get categories actually used in transactions, grouped by type
    const getCategoriesByType = (type) => {
        // Get unique category IDs from transactions of this type
        const categoryIds = [...new Set(
            transactions
                .filter(txn => txn.type === type && txn.category?._id)
                .map(txn => txn.category._id)
        )];

        // Return the full category objects that match these IDs
        return categories.filter(cat =>
            categoryIds.includes(cat._id)
        );
    };

    const expenseCategories = getCategoriesByType('expense');
    const incomeCategories = getCategoriesByType('income');

    console.log('Expense Categories:', expenseCategories);
    console.log('Income Categories:', incomeCategories);

    // Prepare data - group transactions by category for each type
    const expenseData = expenseCategories.map(category =>
        transactions
            .filter(txn =>
                txn.type === 'expense' &&
                txn.category?._id === category._id
            )
            .reduce((acc, txn) => acc + txn.amount, 0)
    );

    const incomeData = incomeCategories.map(category =>
        transactions
            .filter(txn =>
                txn.type === 'income' &&
                txn.category?._id === category._id
            )
            .reduce((acc, txn) => acc + txn.amount, 0)
    );

    console.log('Expense Data:', expenseData);
    console.log('Income Data:', incomeData);

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
    const chartOptions = {
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
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: $${value} (${percentage}%)`;
                    }
                }
            }
        },
    };

    return (
        <S.Container>

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
                    <div>No expense data available</div>
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
                    <div>No income data available</div>
                )}
            </S.ChartWrapper>
        </S.Container>
    );
};

export default FinancialPieChart;