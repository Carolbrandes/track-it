import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Category from '../../../models/Category';
import dbConnect from '../../lib/db';

export async function GET() {
    try {
        await dbConnect();

        const authToken = (await headers()).get('cookie')?.split('authToken=')[1]?.split(';')[0];

        if (!authToken) {
            return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
        }

        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;


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

        const authToken = (await headers()).get('cookie')?.split('authToken=')[1]?.split(';')[0];

        if (!authToken) {
            return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
        }

        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;


        const existingCategory = await Category.findOne({ name, userId });
        if (existingCategory) {
            return NextResponse.json({ error: 'Categoria já existe para este usuário' }, { status: 400 });
        }


        const newCategory = new Category({ name, userId });
        await newCategory.save();

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

