'use server';

import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { parseReceiptCore } from '../lib/parseReceiptCore';

export type { ReceiptItem, ParsedReceipt, ParseReceiptResponse } from '../lib/parseReceiptCore';

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

export async function parseReceipt(
    base64Image: string,
    mimeType: string,
    locale: string = 'pt',
    existingCategories: string[] = []
) {
    const userId = await getUserIdFromToken();
    if (!userId) {
        return { success: false, error: 'Unauthorized' };
    }
    return parseReceiptCore(base64Image, mimeType, locale, existingCategories);
}
