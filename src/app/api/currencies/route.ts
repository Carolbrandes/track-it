import Currency from '@/models/Currency';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/db';

export async function GET() {
    try {
        // Verificação profunda da conexão
        await dbConnect();

        // Verifica se a conexão está realmente ativa
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Conexão não estabelecida');
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
        console.error("Erro detalhado:", {
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