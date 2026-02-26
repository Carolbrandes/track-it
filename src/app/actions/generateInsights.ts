'use server';

import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { generateInsightsCore, type InsightsResponse } from '../lib/generateInsightsCore';

const INSIGHTS_TIMEOUT_MS = 55_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), ms)
        ),
    ]);
}

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
    try {
        return await withTimeout(
            generateInsightsCore(userId, locale),
            INSIGHTS_TIMEOUT_MS
        );
    } catch (err) {
        if (err instanceof Error && err.message === 'REQUEST_TIMEOUT') {
            return { success: false, error: 'REQUEST_TIMEOUT' };
        }
        throw err;
    }
}
