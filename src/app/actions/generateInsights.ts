'use server';

import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { generateInsightsCore } from '../lib/generateInsightsCore';

export type {
    CategoryBreakdown,
    GhostExpense,
    CashFlowForecast,
    InsightsData,
    InsightsResponse,
} from '../lib/generateInsightsCore';

async function getUserIdFromToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;
    if (!token) return null;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    try {
        const { payload } = await jwtVerify(token, secret);
        return payload.userId as string;
    } catch {
        return null;
    }
}

export async function generateFinancialInsights(locale: string = 'pt'): Promise<InsightsResponse> {
    const userId = await getUserIdFromToken();
    if (!userId) {
        return { success: false, error: 'Unauthorized' };
    }
    return generateInsightsCore(userId, locale);
}
