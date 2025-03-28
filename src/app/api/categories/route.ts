// app/api/categories/route.ts
import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Category from '../../../models/Category';
import dbConnect from '../../lib/db';

export async function GET() {
    try {
        await dbConnect();

        // Obtém o token de autenticação do cookie
        const authToken = (await headers()).get('cookie')?.split('authToken=')[1]?.split(';')[0];

        if (!authToken) {
            return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
        }

        // Verifica o JWT e obtém o payload
        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId; // Obtém o userId do payload

        // Busca as categorias do usuário específico
        const categories = await Category.find({ userId }).sort({ createdAt: -1 });

        return NextResponse.json(categories);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        await dbConnect();

        const { name } = await request.json();

        // Obtém o token de autenticação do cookie
        const authToken = (await headers()).get('cookie')?.split('authToken=')[1]?.split(';')[0];

        if (!authToken) {
            return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
        }

        // Verifica o JWT e obtém o payload
        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId; // Obtém o userId do payload

        // Verifica se a categoria já existe para esse usuário
        const existingCategory = await Category.findOne({ name, userId });
        if (existingCategory) {
            return NextResponse.json({ error: 'Categoria já existe para este usuário' }, { status: 400 });
        }

        // Cria a nova categoria associada ao usuário
        const newCategory = new Category({ name, userId });
        await newCategory.save();

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

