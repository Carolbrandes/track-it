import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import dbConnect from '../../../lib/db';

export async function PUT(req: Request) {
    await dbConnect();

    try {
        // Get token from cookies
        const token = req.headers.get('cookie')?.split('; ')
            .find(cookie => cookie.startsWith('authToken='))
            ?.split('=')[1];

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        const userId = decoded.userId;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
        }

        // Get currencyId from request body
        const { currencyId } = await req.json();

        // Validate currencyId
        if (!currencyId) {
            return NextResponse.json(
                { success: false, message: 'Currency ID is required' },
                { status: 400 }
            );
        }

        // Update user's currency preference
        // @ts-expect-error: Ignoring union type compatibility issue with findById method
        const user = await User.findByIdAndUpdate(
            userId,
            { currencyId },
            { new: true }
        ).select('-password -verificationCode');

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                currencyId: user.currencyId
            }
        });
    } catch (error) {
        console.error("Currency update error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update currency'
            },
            { status: 500 }
        );
    }
}