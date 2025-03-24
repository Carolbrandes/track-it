import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import User from '../../../../models/User';
import dbConnect from '../../../lib/db';

export async function POST(req: Request) {
    await dbConnect();
    const { email } = await req.json();

    // Gerar código de verificação
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated verification code:', code); // Debugging

    let user = await User.findOne({ email });

    if (!user) {
        console.log('User does not exist. Creating a new user...');
        user = await User.create({
            email,
            verificationCode: code, // Código de verificação
            selectedTheme: 'light',
            currencyId: new mongoose.Types.ObjectId('67e12322a2f7b8353bceb3f6'), // Dólar Americano como moeda padrão
        });
    } else {
        user.verificationCode = code;  // Atualiza o código de verificação
        await user.save();
    }

    console.log('User after update/creation:', user);

    // Enviar o código por e-mail
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
        subject: 'Your Verification Code',
        text: `Your verification code is ${code}.`,
    });

    return NextResponse.json({ success: true });
}