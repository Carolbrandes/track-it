import { addMonths } from 'date-fns';
import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Transaction from '../../../../models/Transaction';
import dbConnect from '../../../lib/db';
import { invalidateInsightsCache } from '../../../lib/invalidateInsightsCache';

const RECURRING_MONTHS = 12;

async function getAuthToken(): Promise<string | null> {
    const h = await headers();
    const cookie = h.get('cookie');
    const tokenFromCookie = cookie?.split('authToken=')[1]?.split(';')[0];
    if (tokenFromCookie) return tokenFromCookie;
    const authHeader = h.get('authorization');
    if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
    return null;
}

/**
 * POST /api/transactions/backfill
 *
 * Finds all "orphaned" fixed transactions for the authenticated user:
 * those with is_fixed=true but no recurringGroupId (created before the
 * recurring feature existed). For each one, assigns a new recurringGroupId
 * and generates 11 future monthly clones so they appear in subsequent months.
 *
 * Safe to call multiple times — subsequent calls are a no-op when no orphans exist.
 */
export async function POST() {
    try {
        await dbConnect();

        const authToken = await getAuthToken();
        if (!authToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;

        const orphans = await Transaction.find({
            userId,
            is_fixed: true,
            recurringGroupId: { $exists: false },
        });

        if (orphans.length === 0) {
            return NextResponse.json({ backfilled: 0, totalClones: 0 });
        }

        let totalClones = 0;

        for (const orphan of orphans) {
            const recurringGroupId = crypto.randomUUID();

            // Atomic claim: only proceeds if the document still has no recurringGroupId.
            // Prevents duplicate clones when concurrent requests process the same orphan.
            const claimed = await Transaction.findOneAndUpdate(
                { _id: orphan._id, recurringGroupId: { $exists: false } },
                { $set: { recurringGroupId } },
                { new: false }
            );

            if (!claimed) {
                console.info(`[BACKFILL] "${orphan.description}" já foi reivindicado por outra request, pulando.`);
                continue;
            }

            const futureDocs = Array.from({ length: RECURRING_MONTHS - 1 }, (_, i) => ({
                description: orphan.description,
                amount: orphan.amount,
                currency: orphan.currency,
                date: addMonths(orphan.date, i + 1),
                type: orphan.type,
                is_fixed: true,
                recurringGroupId,
                category: orphan.category,
                userId: orphan.userId,
            }));

            try {
                const clones = await Transaction.insertMany(futureDocs);
                totalClones += clones.length;
                console.info(
                    `[BACKFILL] "${orphan.description}" → ${clones.length} clones criados (group: ${recurringGroupId})`
                );
            } catch (insertErr) {
                console.error(
                    `[BACKFILL] insertMany falhou para "${orphan.description}" (group: ${recurringGroupId}):`,
                    insertErr
                );
                throw insertErr;
            }
        }

        await invalidateInsightsCache(userId as string);

        console.info(`[BACKFILL] Concluído: ${orphans.length} transação(ões) reparada(s), ${totalClones} clone(s) criado(s)`);

        return NextResponse.json({ backfilled: orphans.length, totalClones });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Backfill failed';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
