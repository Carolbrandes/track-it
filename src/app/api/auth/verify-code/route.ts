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

    // Limpar o código de verificação
    user.verificationCode = undefined;
    await user.save();

    const response = NextResponse.json({ success: true });

    // 🔥 Definir o cookie `authToken` corretamente
    response.cookies.set('authToken', user._id.toString(), {
        httpOnly: true, // ❌ Impede acesso no frontend
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // 🔒 Corrigido para minúsculo!
        maxAge: 60 * 60 * 24 * 7, // 1 semana
        path: '/',
    });

    return response;
}