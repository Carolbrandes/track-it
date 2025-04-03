import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Transaction from '../../../../models/Transaction';
import dbConnect from '../../../lib/db';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const id = params.id;

        if (!id) {
            return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
        }

        const { description, amount, currency, type, category } = await request.json();


        if (!description || !amount || !currency || !type || !category) {
            return NextResponse.json({ error: 'All fields (description, amount, currency, type, category) are required' }, { status: 400 });
        }

        const authToken = (await headers()).get('cookie')?.split('authToken=')[1]?.split(';')[0];

        if (!authToken) {
            return NextResponse.json({ error: 'Token not found' }, { status: 401 });
        }

        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;


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
        let errorMessage = 'Failed on operation';

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
        }

        const authToken = (await headers()).get('cookie')?.split('authToken=')[1]?.split(';')[0];

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

        return NextResponse.json({ message: 'Transaction deleted successfully' });
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