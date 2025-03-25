import User from '@/models/User';
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';


export async function POST(req: Request) {
    await dbConnect();

    const { email, code } = await req.json();

    if (!email || !code) {
        return NextResponse.json({ success: false, message: 'Email e código são obrigatórios' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user || user.verificationCode !== code) {
        return NextResponse.json({ success: false, message: 'Código inválido' }, { status: 400 });
    }


    user.verificationCode = undefined;
    await user.save();

    const response = NextResponse.json({ success: true });


    response.cookies.set('authToken', user._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });

    return response;
}