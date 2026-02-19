import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import Currency from '../../../models/Currency';
import dbConnect from '../../lib/db';

export async function GET() {
    try {
        await dbConnect();

        if (mongoose.connection.readyState !== 1) {
            throw new Error('Connection is not established');
        }
        const currencies = await Currency.find({}, { _id: 1, name: 1, code: 1 }).lean();

        return NextResponse.json(
            { success: true, currencies },
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error: unknown) {
        let errorMessage = 'Failed on operation';

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        console.error("Detailed error:", {
            error: errorMessage,
            connectionState: mongoose.connection.readyState,
            connectionInfo: mongoose.connection
        });

        return NextResponse.json(
            {
                success: false,
                message: 'Database connection failed',
                error: errorMessage,
                connectionState: mongoose.connection.readyState
            },
            { status: 500 }
        );
    }
}

