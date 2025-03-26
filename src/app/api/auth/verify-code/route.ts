import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import dbConnect from '../../../lib/db';

export async function POST(req: Request) {
    await dbConnect();
    const { email, code } = await req.json();

    if (!email || !code) {
        return NextResponse.json(
            { success: false, message: 'Email e código são obrigatórios' },
            { status: 400 }
        );
    }

    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json(
            { success: false, message: 'Usuário não encontrado' },
            { status: 400 }
        );
    }

    if (String(user.verificationCode) !== String(code)) {
        return NextResponse.json(
            { success: false, message: 'Código inválido' },
            { status: 400 }
        );
    }

    // Remover código de verificação
    await User.findByIdAndUpdate(user._id, { $unset: { verificationCode: 1 } });

    // Gerar JWT
    const token = await new SignJWT({ userId: user._id.toString() })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    // Configurar resposta
    const response = NextResponse.json(
        { success: true },
        { status: 200 }
    );

    // Configurar cookie
    response.cookies.set({
        name: 'authToken',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Mais compatível que 'strict'
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    });

    return response;
}