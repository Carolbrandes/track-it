
import Transaction from '@/models/Transaction';
import Category from '@/models/Category';
import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import db from '../../lib/db';
import { createTransactionSchema, formatZodError } from '../../lib/validations';

interface FilterQuery {
    description?: { $regex: string; $options: string } | string;
    category?: string | null;
    type?: string | null;
    amount?: { $gte?: number; $lte?: number } | string | null;
    date?: { $gte?: Date; $lte?: Date } | Date;
    userId?: string | null;
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

        const currentDate = new Date();
        const month = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1
        const year = currentDate.getFullYear();

        // Set the start date to the first of the month
        const startDate = new Date(year, month - 1, 1); // April 1, 2025
        // Set the end date to the last day of the month
        const endDate = new Date(year, month, 0); // April 30, 2025

        filterQuery.date = {
            $gte: startDate, // from April 1, 2025
            $lte: endDate    // until April 30, 2025
        };


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

        // Handle date range filter
        const startDateParam = url.searchParams.get('startDate');
        const endDateParam = url.searchParams.get('endDate');

        if (startDateParam && endDateParam) {
            const startDate = new Date(startDateParam);
            const endDate = new Date(endDateParam);

            const startUTC = new Date(startDate.setHours(0, 0, 0, 0));
            const endUTC = new Date(endDate.setHours(23, 59, 59, 999));

            filterQuery.date = {
                $gte: startUTC,
                $lte: endUTC
            };
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