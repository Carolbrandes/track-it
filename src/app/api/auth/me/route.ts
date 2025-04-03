import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import dbConnect from '../../../lib/db';

export async function GET(req) {
    await dbConnect();

    const token = req.cookies.get('authToken');

    if (!token) {
        return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;



        if (!decoded.userId) {
            return NextResponse.json({ isLoggedIn: false }, { status: 401 });
        }

        const user = await User.findById(decoded.userId).select('-verificationCode');


        if (!user) {
            return NextResponse.json({ isLoggedIn: false }, { status: 401 });
        }

        return NextResponse.json({ isLoggedIn: true, user });
    } catch (error) {
        console.error("🚀 ~ GET ~ error:", error)
        return NextResponse.json({ isLoggedIn: false, message: 'Token inválido' }, { status: 401 });
    }
}