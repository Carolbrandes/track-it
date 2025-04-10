import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Transaction from '../../../../models/Transaction';
import dbConnect from '../../../lib/db';

export async function PUT(request: NextRequest) {
    try {
        await dbConnect();

        const id = request.nextUrl.pathname.split('/').pop();

        if (!id) {
            return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
        }

        const { description, amount, currency, type, category } = await request.json();
        if (!description || !amount || !currency || !type || !category) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const authToken = (await headers()).get('cookie')?.split('authToken=')[1]?.split(';')[0];
        if (!authToken) {
            return NextResponse.json({ error: 'Token not found' }, { status: 401 });
        }

        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;
        // @ts-expect-error: Ignoring union type compatibility issue with findById method
        const transaction = await Transaction.findOne({ _id: id, userId });
        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found or does not belong to user' }, { status: 404 });
        }

        transaction.description = description;
        transaction.amount = amount;
        transaction.currency = currency;
        transaction.type = type;
        transaction.category = category;

        await transaction.save();
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

        const authToken = (await headers()).get('cookie')?.split('authToken=')[1]?.split(';')[0];
        if (!authToken) {
            return NextResponse.json({ error: 'Token not found' }, { status: 401 });
        }

        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;

        // @ts-expect-error: Ignoring union type compatibility issue with findById method
        const transaction = await Transaction.findOne({ _id: id, userId });
        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found or does not belong to user' }, { status: 404 });
        }
        // @ts-expect-error: Ignoring union type compatibility issue with findById method
        await Transaction.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Transaction deleted successfully' });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed on operation';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}