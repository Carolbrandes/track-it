import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import User, { IUser } from '../../../models/User'; // Certifique-se de exportar IUser no modelo
import dbConnect from '../../lib/db';

export async function GET() {
    try {
        console.log('📡 Conectando ao MongoDB...');
        await dbConnect();

        const authToken = (await headers()).get('cookie')?.split('authToken=')[1]?.split(';')[0];

        if (!authToken) {
            return NextResponse.json(
                { success: false, message: 'Token não encontrado' },
                { status: 401 }
            );
        }

        const { payload } = await jwtVerify(
            authToken,
            new TextEncoder().encode(process.env.JWT_SECRET!)
        );

        if (!payload.userId) {
            return NextResponse.json(
                { success: false, message: 'Token inválido' },
                { status: 403 }
            );
        }

        console.log(`🔍 Buscando usuário com ID: ${payload.userId}`);
        const user = await User.findById(payload.userId).lean().exec() as unknown as IUser | null;

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        console.log(`✅ Usuário encontrado: ${user.email}`);

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                email: user.email,
                selectedTheme: user.selectedTheme,
                currencyId: user.currencyId,
            }
        });

    } catch (error) {
        console.error('❌ Erro na rota /api/user:', error);
        return NextResponse.json(
            { success: false, message: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}