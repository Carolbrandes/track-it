// app/api/transactions/route.ts
import Transaction from '@/models/Transaction';
import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import db from '../../lib/db';

// app/api/transactions/route.ts
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

        // Build filter query
        const filterQuery: any = { userId };

        // Add filters if they exist
        if (url.searchParams.get('description')) {
            filterQuery.description = { $regex: url.searchParams.get('description'), $options: 'i' };
        }
        if (url.searchParams.get('category')) {
            filterQuery.category = url.searchParams.get('category');
        }
        if (url.searchParams.get('type')) {
            filterQuery.type = url.searchParams.get('type');
        }
        if (url.searchParams.get('minAmount')) {
            filterQuery.amount = { ...filterQuery.amount, $gte: parseFloat(url.searchParams.get('minAmount')!) };
        }
        if (url.searchParams.get('maxAmount')) {
            filterQuery.amount = { ...filterQuery.amount, $lte: parseFloat(url.searchParams.get('maxAmount')!) };
        }
        if (url.searchParams.get('startDate') && url.searchParams.get('endDate')) {
            const startDate = new Date(url.searchParams.get('startDate')!);
            const endDate = new Date(url.searchParams.get('endDate')!);

            console.log("🚀 ~ GET ~ startDate:", startDate)
            console.log("🚀 ~ GET ~ endDate:", endDate)

            // Set start time to 00:00:00.000 (midnight) for the start of the day
            const startUTC = new Date(startDate.setHours(0, 0, 0, 0));

            // Set end time to 23:59:59.999 (end of the day)
            const endUTC = new Date(endDate.setHours(23, 59, 59, 999));

            console.log("🚀 ~ GET ~ startUTC:", startUTC)
            console.log("🚀 ~ GET ~ endUTC:", endUTC)

            filterQuery.date = {
                $gte: startUTC,   // Greater than or equal to start of the day
                $lte: endUTC      // Less than or equal to end of the day
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
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await db();
        const authToken = (await headers()).get('cookie')?.split('authToken=')[1]?.split(';')[0];
        if (!authToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;

        const { description, amount, currency, date, type, category } = await request.json();

        // Validate required fields
        if (!description || !amount || !currency || !date || !type || !category) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const newTransaction = new Transaction({
            description,
            amount,
            currency,
            date: new Date(date),
            type,
            category,
            userId
        });

        await newTransaction.save();
        return NextResponse.json(newTransaction, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}