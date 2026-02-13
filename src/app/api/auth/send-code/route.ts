import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import User from '../../../../models/User';
import dbConnect from '../../../lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    await dbConnect();

    const { email } = await request.json();

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Verifique se o usuário existe ou crie um novo usuário
    // @ts-expect-error: Ignoring union type compatibility issue with findById method
    let user = await User.findOne({ email });

    if (!user) {
        // Criar um novo usuário com o código de verificação
        // @ts-expect-error: Ignoring union type compatibility issue with findById method
        user = await User.create({
            email,
            verificationCode: code,
            selectedTheme: 'light',
            currencyId: new mongoose.Types.ObjectId('67e12322a2f7b8353bceb3f6'),
        });
    } else {
        // Se o usuário já existe, só atualize o código de verificação
        user.verificationCode = code;
        await user.save();
    }

    await resend.emails.send({
        from: 'Track It <noreply@trackit.tec.br>',
        to: email,
        subject: 'Seu Código de Verificação',
        text: `Seu código de verificação é ${code}.`,
    });

    return NextResponse.json({ success: true });
}