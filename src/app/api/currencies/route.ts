import { NextResponse } from 'next/server';
import Currency from '../../../models/Currency';
import dbConnect from '../../lib/db';

export async function GET() {
    await dbConnect();


    try {
        const currencies = await Currency.find({}, { _id: 1, name: 1, code: 1 }).lean();

        return NextResponse.json(
            { success: true, currencies },
            { headers: { 'Access-Control-Allow-Origin': '*' } }
        );
    } catch (error) {
        console.error("🚀 ~ GET ~ currencies error:", error);
        return NextResponse.json({ success: false, message: 'Failed to fetch currencies' }, { status: 500 });
    }
}