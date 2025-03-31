import Currency from '@/models/Currency';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/db';

export async function GET() {
    try {

        await dbConnect();


        if (mongoose.connection.readyState !== 1) {
            throw new Error('Conecction is not established');
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
    } catch (error: any) {
        console.error("Detailed error:", {
            error: error.message,
            connectionState: mongoose.connection.readyState,
            connectionInfo: mongoose.connection
        });

        return NextResponse.json(
            {
                success: false,
                message: 'Database connection failed',
                error: error.message,
                connectionState: mongoose.connection.readyState
            },
            { status: 500 }
        );
    }
}