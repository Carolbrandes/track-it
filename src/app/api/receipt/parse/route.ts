import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { parseReceiptCore } from '../../../lib/parseReceiptCore';

const PARSE_TIMEOUT_MS = 90_000;
const MAX_BODY_BYTES = 10 * 1024 * 1024; // 10mb — fotos grandes: use FormData + compressão no app

async function getAuthToken(): Promise<string | null> {
    const h = await headers();
    const tokenFromCookie = h.get('cookie')?.split('authToken=')[1]?.split(';')[0];
    if (tokenFromCookie) return tokenFromCookie;
    const authHeader = h.get('authorization');
    if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
    return null;
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

// Sanity check: garante que a chave da IA está disponível (evita falha silenciosa)
const GEMINI_KEY_SANITY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY_SANITY) {
    console.warn('[Receipt Parse] GEMINI_API_KEY is undefined — receipt parsing will fail.');
} else {
    console.info('[Receipt Parse] GEMINI_API_KEY is set (length:', GEMINI_KEY_SANITY.length, ')');
}

export async function POST(request: NextRequest) {
    try {
        const authToken = await getAuthToken();
        if (!authToken) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
    } catch (authErr) {
        console.error('Receipt parse API auth error:', authErr);
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let base64Image: string;
    let mimeType: string;
    let locale = 'pt';
    let existingCategories: string[] = [];

    const contentType = request.headers.get('content-type') ?? '';

    try {
        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('image') as File | null;
            if (!file || !file.size) {
                return NextResponse.json(
                    { success: false, error: 'image file is required' },
                    { status: 400 }
                );
            }
            if (file.size > MAX_BODY_BYTES) {
                return NextResponse.json(
                    { success: false, error: 'Image too large. Maximum 10MB.' },
                    { status: 413 }
                );
            }
            const buf = await file.arrayBuffer();
            const bytes = new Uint8Array(buf);
            let binary = '';
            for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            base64Image = Buffer.from(binary, 'binary').toString('base64');
            mimeType = file.type || 'image/jpeg';
            const localeVal = formData.get('locale');
            if (typeof localeVal === 'string') locale = localeVal;
            const catsVal = formData.get('existingCategories');
            if (typeof catsVal === 'string') {
                try {
                    const parsed = JSON.parse(catsVal);
                    existingCategories = Array.isArray(parsed) ? parsed : [];
                } catch {
                    existingCategories = [];
                }
            }
        } else {
            const body = await request.json().catch((err: unknown) => {
                const msg = err instanceof Error ? err.message : String(err);
                console.error('[Receipt Parse] request.json() failed:', msg, err);
                if (
                    msg.includes('body') ||
                    msg.includes('payload') ||
                    msg.includes('size') ||
                    msg.includes('limit')
                ) {
                    throw Object.assign(new Error('Payload too large'), { status: 413 });
                }
                throw err;
            });
            const { base64Image: b64, mimeType: mime, locale: loc = 'pt', existingCategories: cats = [] } = body;
            if (!b64 || !mime) {
                return NextResponse.json(
                    { success: false, error: 'base64Image and mimeType are required' },
                    { status: 400 }
                );
            }
            base64Image = b64;
            mimeType = mime;
            locale = typeof loc === 'string' ? loc : 'pt';
            existingCategories = Array.isArray(cats) ? cats : [];
        }
    } catch (err: unknown) {
        if (err && typeof (err as { status?: number }).status === 'number' && (err as { status: number }).status === 413) {
            return NextResponse.json(
                { success: false, error: 'Image too large. Maximum 10MB.' },
                { status: 413 }
            );
        }
        console.error('Receipt parse API body error:', err);
        return NextResponse.json(
            { success: false, error: err instanceof Error ? err.message : 'Invalid request body' },
            { status: 400 }
        );
    }

    try {
        const result = await withTimeout(
            parseReceiptCore(base64Image, mimeType, locale, existingCategories),
            PARSE_TIMEOUT_MS
        );
        return NextResponse.json(result);
    } catch (error) {
        // Log detalhado para ver no terminal EXATAMENTE o que a API do provedor (Gemini) retorna
        console.error('Receipt parse API error (full):', error);
        if (error && typeof error === 'object') {
            console.error('Receipt parse API error (stack):', (error as Error).stack);
            console.error('Receipt parse API error (name):', (error as Error).name);
            if ('response' in error) console.error('Receipt parse API error (response):', (error as { response?: unknown }).response);
            if ('cause' in error) console.error('Receipt parse API error (cause):', (error as { cause?: unknown }).cause);
        }
        const msg = error instanceof Error ? error.message : 'Failed to parse receipt';
        const isTimeout = msg === 'REQUEST_TIMEOUT';
        const isRateLimit = msg.includes('429');
        const status = isTimeout ? 504 : isRateLimit ? 429 : 500;
        const friendlyMessage = isTimeout
            ? 'Request timed out. Try a smaller image.'
            : isRateLimit
              ? 'RATE_LIMIT'
              : msg;
        return NextResponse.json(
            { success: false, error: friendlyMessage },
            { status }
        );
    }
}
