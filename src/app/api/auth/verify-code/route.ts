import mongoose from 'mongoose';
import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import dbConnect from '../../../lib/db';
import { isPlayStoreReviewLogin } from '../../../lib/playstore-review-account';
import { formatZodError, verifyCodeSchema } from '../../../lib/validations';

const DEFAULT_CURRENCY_ID = new mongoose.Types.ObjectId('67e12322a2f7b8353bceb3f6');

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

    // Bypass para conta de teste da Google Play Store: não consulta DB/envio de e-mail
    if (isPlayStoreReviewLogin(email, code)) {
        let user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            user = await User.create({
                email: email.trim().toLowerCase(),
                verificationCode: '',
                selectedTheme: 'light',
                currencyId: DEFAULT_CURRENCY_ID,
            });
        }
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
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });
        return response;
    }

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