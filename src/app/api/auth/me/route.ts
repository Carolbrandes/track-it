import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import dbConnect from '../../../lib/db';

export async function GET(req) {
    await dbConnect();

    // Pegar o token do cookie
    const token = req.cookies.get('authToken');
    console.log("🚀 ~ GET ~ token:", token)

    if (!token) {
        return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    try {
        // Verificar o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload; // Assegura que decoded é um JwtPayload
        console.log("🚀 ~ GET ~ decoded:", decoded)

        // Verificar se a propriedade userId existe
        if (!decoded.userId) {
            return NextResponse.json({ isLoggedIn: false }, { status: 401 });
        }

        const user = await User.findById(decoded.userId).select('-verificationCode');
        console.log("🚀 ~ GET ~ user:", user)

        if (!user) {
            return NextResponse.json({ isLoggedIn: false }, { status: 401 });
        }

        return NextResponse.json({ isLoggedIn: true, user });
    } catch (error) {
        return NextResponse.json({ isLoggedIn: false, message: 'Token inválido' }, { status: 401 });
    }
}