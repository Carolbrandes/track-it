import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import User from '../../../../models/User';
import dbConnect from '../../../lib/db';

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



    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Track It" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Seu Código de Verificação',
        text: `Seu código de verificação é ${code}.`,
    });

    return NextResponse.json({ success: true });
}