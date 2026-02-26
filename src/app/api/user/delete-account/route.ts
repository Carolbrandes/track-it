import mongoose from 'mongoose';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import Transaction from '../../../../models/Transaction';
import Category from '../../../../models/Category';
import dbConnect from '../../../lib/db';

export async function DELETE() {
    try {
        await dbConnect();

        const cookieStore = await cookies();
        const authToken = cookieStore.get('authToken')?.value;
        if (!authToken) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? '');
        const { payload } = await jwtVerify(authToken, secret);
        const userId = payload.userId as string;
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        await Promise.all([
            Transaction.deleteMany({ userId: userObjectId }),
            Category.deleteMany({ userId: userObjectId }),
        ]);
        await User.findByIdAndDelete(userObjectId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[delete-account] Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete account' },
            { status: 500 }
        );
    }
}
