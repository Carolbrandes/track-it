import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import dbConnect from '../../../lib/db';

export async function POST(req: Request) {
    await dbConnect();
    const { email, currencyId } = await req.json();

    try {
        const user = await User.findOneAndUpdate(
            { email },
            { currencyId },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("🚀 ~ POST ~ update currency error:", error)
        return NextResponse.json({ success: false, message: 'Failed to update currency' }, { status: 500 });
    }
}