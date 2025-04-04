import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server'; // Importe o NextRequest
import User from '../../../../models/User';
import dbConnect from '../../../lib/db';

export async function GET(req: NextRequest) {
    await dbConnect();

    const token = req.cookies.get('authToken')?.value; // Acessando o valor da cookie diretamente

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
        console.error("🚀 ~ GET ~ error:", error);
        return NextResponse.json({ isLoggedIn: false, message: 'Token inválido' }, { status: 401 });
    }
}