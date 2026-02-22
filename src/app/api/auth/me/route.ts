import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import User, { IUser } from '../../../../models/User'; // Import the IUser interface
import dbConnect from '../../../lib/db';

export async function GET(req: NextRequest) {
    await dbConnect();

    // Support both cookie (web) and Bearer token (mobile)
    let token = req.cookies.get('authToken')?.value;
    if (!token) {
        const authHeader = req.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.slice(7);
        }
    }

    if (!token) {
        return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in environment variables.");
            return NextResponse.json({ isLoggedIn: false, message: 'Server configuration error' }, { status: 500 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

        if (!decoded.userId) {
            return NextResponse.json({ isLoggedIn: false }, { status: 401 });
        }

        let userId: mongoose.Types.ObjectId;
        if (typeof decoded.userId === 'string') {
            try {
                userId = new mongoose.Types.ObjectId(decoded.userId);
            } catch (error) {
                console.error("🚀 ~ GET ~ error:", error)
                console.error("Invalid ObjectId string:", decoded.userId);
                return NextResponse.json({ isLoggedIn: false, message: 'Invalid User ID' }, { status: 400 });
            }
        } else if (decoded.userId instanceof mongoose.Types.ObjectId) {
            userId = decoded.userId;
        } else {
            console.error("Unexpected type for decoded.userId:", typeof decoded.userId);
            return NextResponse.json({ isLoggedIn: false, message: 'Invalid User ID format' }, { status: 400 });
        }

        const user = await User.findById(userId)
            .select('-verificationCode')
            .exec() as unknown as IUser | null;

        if (!user) {
            return NextResponse.json({ isLoggedIn: false }, { status: 401 });
        }

        return NextResponse.json({ isLoggedIn: true, user });
    } catch (error) {
        console.error("Token verification error:", error);
        return NextResponse.json({ isLoggedIn: false, message: 'Token inválido' }, { status: 401 });
    }
}