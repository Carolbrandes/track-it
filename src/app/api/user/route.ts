import User from '@/models/User';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/db';

export async function GET(request: Request) {
    await dbConnect();

    // Extract the authToken from cookies
    const authToken = (await cookies()).get('authToken')?.value;


    if (!authToken) {
        return NextResponse.json(
            { success: false, message: 'Unauthorized' },
            { status: 401 }
        );
    }

    // Find the user by their ID (stored in authToken)
    const user = await User.findById(authToken);


    if (!user) {
        return NextResponse.json(
            { success: false, message: 'User not found' },
            { status: 404 }
        );
    }

    // Return the user data (excluding sensitive fields like verificationCode)
    return NextResponse.json({
        success: true,
        user: {
            email: user.email,
            selectedTheme: user.selectedTheme,
            currencyId: user.currencyId,
        },
    });
}