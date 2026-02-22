import { jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { generateInsightsCore } from '@/app/lib/generateInsightsCore';

const INSIGHTS_TIMEOUT_MS = 90_000;

async function getAuthToken(): Promise<string | null> {
    const h = await headers();
    const authHeader = h.get('authorization');
    if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
    const cookieStore = await cookies();
    return cookieStore.get('authToken')?.value ?? null;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), ms)
        ),
    ]);
}

export const maxDuration = 60;

// Sanity check: garante que a chave da IA está disponível
const GEMINI_KEY_SANITY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY_SANITY) {
    console.warn('[Insights] GEMINI_API_KEY is undefined — insights will fail.');
} else {
    console.info('[Insights] GEMINI_API_KEY is set (length:', GEMINI_KEY_SANITY.length, ')');
}

export async function GET(request: NextRequest) {
    try {
        const authToken = await getAuthToken();
        if (!authToken) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? '');
        const { payload } = await jwtVerify(authToken, secret);
        const userId = payload.userId as string;
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const locale = searchParams.get('locale') ?? 'pt';

        const result = await withTimeout(
            generateInsightsCore(userId, locale),
            INSIGHTS_TIMEOUT_MS
        );
        return NextResponse.json(result);
    } catch (error) {
        // Log detalhado para ver no terminal EXATAMENTE o que a API do provedor (Gemini) retorna
        console.error('Insights API error (full):', error);
        if (error && typeof error === 'object') {
            console.error('Insights API error (stack):', (error as Error).stack);
            console.error('Insights API error (name):', (error as Error).name);
            if ('response' in error) console.error('Insights API error (response):', (error as { response?: unknown }).response);
            if ('cause' in error) console.error('Insights API error (cause):', (error as { cause?: unknown }).cause);
        }
        const msg = error instanceof Error ? error.message : 'Failed to generate insights';
        const isTimeout = msg === 'REQUEST_TIMEOUT';
        const status = isTimeout ? 504 : 500;
        const friendlyMessage = isTimeout
            ? 'Request timed out. Please try again.'
            : msg;
        return NextResponse.json(
            { success: false, error: friendlyMessage },
            { status }
        );
    }
}
