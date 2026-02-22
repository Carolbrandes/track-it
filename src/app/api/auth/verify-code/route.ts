import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import dbConnect from '../../../lib/db';
import { formatZodError, verifyCodeSchema } from '../../../lib/validations';

export async function POST(req: Request) {
    await dbConnect();
    const body = await req.json();
    const result = verifyCodeSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            { success: false, message: formatZodError(result.error) },
            { status: 400 }
        );
    }

    const { email, code } = result.data;

    // Encontrar o usuário com base no e-mail
    const user = await User.findOne({ email });


    if (!user) {
        return NextResponse.json(
            { success: false, message: 'Usuário não encontrado' },
            { status: 400 }
        );
    }

    // Comparar o código informado pelo usuário com o código salvo
    if (String(user.verificationCode) !== String(code)) {
        return NextResponse.json(
            { success: false, message: 'Código inválido' },
            { status: 400 }
        );
    }

    // Limpar o código de verificação após a validação
    await User.findByIdAndUpdate(user._id, { $unset: { verificationCode: 1 } });

    // Gerar o token JWT
    const token = await new SignJWT({ userId: user._id.toString() })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    const response = NextResponse.json(
        { success: true },
        { status: 200 }
    );

    response.cookies.set({
        name: 'authToken',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // mais compatível que 'strict'
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    });

    return response;
}