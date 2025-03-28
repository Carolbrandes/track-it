// app/api/transactions/route.ts
import Transaction from '@/models/Transaction';
import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import db from '../../lib/db';

export async function GET(request: Request) {
    try {
        await db();
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const transactions = await Transaction.find({ userId }).populate('category');
        return NextResponse.json(transactions);
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