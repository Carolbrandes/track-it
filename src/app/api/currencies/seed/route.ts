import dbConnect from '@/app/lib/db';
import Currency from '@/models/Currency';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConnect();

        const currenciesCount = await Currency.countDocuments();

        if (currenciesCount === 0) {
            console.log('Seed: Populando banco de dados com moedas padrão...');
            const defaultCurrencies = [
                { _id: new mongoose.Types.ObjectId('67e12322a2f7b8353bceb3f6'), name: 'Real Brasileiro', code: 'BRL' },
                { name: 'Guarani Paraguaio', code: 'PYG' },
                { name: 'Dólar Americano', code: 'USD' },
                { name: 'Euro', code: 'EUR' }
            ];

            await Currency.insertMany(defaultCurrencies);
            console.log('Seed: Moedas inseridas com sucesso!');
        }

        const currencies = await Currency.find({}, { _id: 1, name: 1, code: 1 }).lean();

        return NextResponse.json({
            success: true,
            message: currenciesCount === 0 ? 'Moedas cadastradas com sucesso!' : 'Moedas já existiam no banco.',
            currencies
        });
    } catch (error) {
        console.error('Error in currencies seed:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch/seed currencies' }, { status: 500 });
    }
}
