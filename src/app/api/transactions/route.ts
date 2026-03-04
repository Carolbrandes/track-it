
import Transaction from '@/models/Transaction';
import Category from '@/models/Category';
import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import db from '../../lib/db';
import { invalidateInsightsCache } from '../../lib/invalidateInsightsCache';
import { createTransactionSchema, formatZodError } from '../../lib/validations';

interface FilterQuery {
    description?: { $regex: string; $options: string } | string;
    category?: string | null;
    type?: string | null;
    amount?: { $gte?: number; $lte?: number } | string | null;
    date?: { $gte?: Date; $lte?: Date } | Date;
    userId?: string | null;
    is_fixed?: boolean | null;
}

// Ensure Category model is registered before using populate('category')
const _CategoryModel = Category;


export async function GET(request: Request) {
    try {
        await db();
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }


        const filterQuery: FilterQuery = {
            userId: userId || null
        };

        // Handle date range filter - only apply when explicitly provided
        const startDateParam = url.searchParams.get('startDate');
        const endDateParam = url.searchParams.get('endDate');

        if (startDateParam && endDateParam) {
            const startUTC = new Date(startDateParam + 'T00:00:00.000Z');
            const endUTC = new Date(endDateParam + 'T23:59:59.999Z');

            filterQuery.date = {
                $gte: startUTC,
                $lte: endUTC
            };
        }

        // Handle description filter
        const descriptionParam = url.searchParams.get('description');
        if (descriptionParam) {
            filterQuery.description = {
                $regex: descriptionParam,
                $options: 'i'
            };
        }

        // Handle category filter
        const categoryParam = url.searchParams.get('category');
        if (categoryParam) {
            filterQuery.category = categoryParam;
        }

        // Handle type filter
        const typeParam = url.searchParams.get('type');
        if (typeParam) {
            filterQuery.type = typeParam;
        }

        // Handle isFixed filter
        const isFixedParam = url.searchParams.get('isFixed');
        if (isFixedParam === 'true') {
            filterQuery.is_fixed = true;
        }

        // Handle amount filters
        const minAmountParam = url.searchParams.get('minAmount');
        const maxAmountParam = url.searchParams.get('maxAmount');

        if (minAmountParam || maxAmountParam) {
            filterQuery.amount = {};

            if (minAmountParam) {
                (filterQuery.amount as { $gte: number }).$gte = parseFloat(minAmountParam);
            }

            if (maxAmountParam) {
                (filterQuery.amount as { $lte: number }).$lte = parseFloat(maxAmountParam);
            }
        }

        const totalCount = await Transaction.countDocuments(filterQuery);
        const totalPages = Math.ceil(totalCount / limit);
        const transactions = await Transaction.find(filterQuery)
            .populate('category')
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(limit);



        return NextResponse.json({
            data: transactions,
            totalCount,
            totalPages
        });
    } catch (error: unknown) {
        let errorMessage = 'Failed on operation';

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

async function getAuthToken(): Promise<string | null> {
    const h = await headers();
    const tokenFromCookie = h.get('cookie')?.split('authToken=')[1]?.split(';')[0];
    if (tokenFromCookie) return tokenFromCookie;
    const authHeader = h.get('authorization');
    if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
    return null;
}

export async function POST(request: Request) {
    try {
        await db();
        const authToken = await getAuthToken();
        if (!authToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;

        const body = await request.json();
        const result = createTransactionSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: formatZodError(result.error) }, { status: 400 });
        }

        const { description, amount, currency, date, type, category, is_fixed } = result.data;

        const newTransaction = new Transaction({
            description,
            amount,
            currency,
            date: new Date(date),
            type,
            is_fixed: is_fixed ?? null,
            category,
            userId
        });

        await newTransaction.save();
        await invalidateInsightsCache(userId as string);
        return NextResponse.json(newTransaction, { status: 201 });
    } catch (error: unknown) {
        let errorMessage = 'Failed on operation';

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}