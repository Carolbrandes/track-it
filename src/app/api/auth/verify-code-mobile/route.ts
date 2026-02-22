import mongoose from 'mongoose';
import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import dbConnect from '../../../lib/db';
import { isPlayStoreReviewLogin } from '../../../lib/playstore-review-account';
import { formatZodError, verifyCodeSchema } from '../../../lib/validations';

const DEFAULT_CURRENCY_ID = new mongoose.Types.ObjectId('67e12322a2f7b8353bceb3f6');

/**
 * Mobile-specific auth endpoint. Returns JWT token in response body
 * instead of setting httpOnly cookies (which mobile apps cannot use).
 * Use Authorization: Bearer <token> for subsequent API calls.
 */
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
        return NextResponse.json(
            { success: true, token },
            { status: 200 }
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

    await User.findByIdAndUpdate(user._id, { $unset: { verificationCode: 1 } });

    const token = await new SignJWT({ userId: user._id.toString() })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    return NextResponse.json(
        { success: true, token },
        { status: 200 }
    );
}
