import { addMonths } from 'date-fns';
import { jwtVerify } from 'jose';
import { Types } from 'mongoose';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Transaction from '../../../../models/Transaction';
import dbConnect from '../../../lib/db';
import { invalidateInsightsCache } from '../../../lib/invalidateInsightsCache';
import { formatZodError, updateTransactionSchema } from '../../../lib/validations';

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

export async function PUT(request: NextRequest) {
    try {
        await dbConnect();

        const id = request.nextUrl.pathname.split('/').pop();

        if (!id) {
            return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
        }

        const body = await request.json();
        const result = updateTransactionSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: formatZodError(result.error) }, { status: 400 });
        }

        const { description, amount, currency, type, category, is_fixed } = result.data;

        const authToken = await getAuthToken();
        if (!authToken) {
            return NextResponse.json({ error: 'Token not found' }, { status: 401 });
        }

        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;
        const transaction = await Transaction.findOne({ _id: id, userId });
        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found or does not belong to user' }, { status: 404 });
        }

        const wasNotRecurring = !transaction.recurringGroupId;

        // Derive the final is_fixed value: use whatever the client sent if explicitly
        // provided, otherwise preserve what was already stored on the document.
        // This ensures orphaned fixed transactions (is_fixed=true but no recurringGroupId,
        // created before the recurring feature existed) also get their clones backfilled.
        const effectiveIsFixed = is_fixed === undefined ? transaction.is_fixed : is_fixed;
        const becomingFixed = wasNotRecurring && effectiveIsFixed === true;

        transaction.description = description;
        transaction.amount = amount;
        transaction.currency = currency;
        transaction.type = type;
        transaction.category = new Types.ObjectId(category);
        transaction.is_fixed = effectiveIsFixed ?? null;

        if (becomingFixed) {
            const recurringGroupId = crypto.randomUUID();
            transaction.recurringGroupId = recurringGroupId;

            // Start from month 1 — month 0 is the transaction being updated right now
            const futureDocs = Array.from({ length: RECURRING_MONTHS - 1 }, (_, i) => ({
                description,
                amount,
                currency,
                date: addMonths(transaction.date, i + 1),
                type,
                is_fixed: true,
                recurringGroupId,
                category,
                userId,
            }));

            await transaction.save();

            try {
                const clones = await Transaction.insertMany(futureDocs);
                console.info(
                    `[PUT /transactions] Backfill: created ${clones.length} recurring clones for group ${recurringGroupId}`
                );
            } catch (insertErr) {
                console.error(
                    `[PUT /transactions] insertMany failed for group ${recurringGroupId}:`,
                    insertErr
                );
                throw insertErr;
            }
        } else {
            await transaction.save();
        }

        await invalidateInsightsCache(userId as string);
        return NextResponse.json(transaction);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed on operation';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await dbConnect();

        const id = request.nextUrl.pathname.split('/').pop();

        if (!id) {
            return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
        }

        const authToken = await getAuthToken();
        if (!authToken) {
            return NextResponse.json({ error: 'Token not found' }, { status: 401 });
        }

        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;

        const transaction = await Transaction.findOne({ _id: id, userId });
        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found or does not belong to user' }, { status: 404 });
        }
        await Transaction.findByIdAndDelete(id);
        await invalidateInsightsCache(userId as string);
        return NextResponse.json({ message: 'Transaction deleted successfully' });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed on operation';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}