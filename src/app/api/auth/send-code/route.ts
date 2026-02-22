import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import User from '../../../../models/User';
import dbConnect from '../../../lib/db';
import { isPlayStoreReviewEmail } from '../../../lib/playstore-review-account';
import { formatZodError, sendCodeSchema } from '../../../lib/validations';

export async function POST(request: Request) {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        await dbConnect();

        const body = await request.json();
        const result = sendCodeSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: formatZodError(result.error) },
                { status: 400 }
            );
        }

        const { email } = result.data;

        // Conta de teste Google Play: não envia e-mail; o avaliador usa o código fixo 123456
        if (isPlayStoreReviewEmail(email)) {
            return NextResponse.json({ success: true });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`[DEV] Verification code for ${email}: ${code}`);

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                verificationCode: code,
                selectedTheme: 'light',
                currencyId: new mongoose.Types.ObjectId('67e12322a2f7b8353bceb3f6'),
            });
        } else {
            user.verificationCode = code;
            await user.save();
        }

        const { error } = await resend.emails.send({
            from: 'Track It <noreply@trackit.tec.br>',
            to: email,
            subject: 'Seu Código de Verificação',
            text: `Seu código de verificação é ${code}.`,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                { success: false, message: 'Erro ao enviar email de verificação' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('send-code error:', err);
        return NextResponse.json(
            { success: false, message: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}