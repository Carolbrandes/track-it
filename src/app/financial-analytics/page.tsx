'use client';

import FinancialPieChart from './components/FinancialPieChart';

export default function FinancialAnalyticsPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Financial Analytics</h1>
            <FinancialPieChart />
        </div>
    );
}