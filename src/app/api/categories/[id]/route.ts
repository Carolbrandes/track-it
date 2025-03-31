import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Category from '../../../../models/Category';
import dbConnect from '../../../lib/db';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const id = params.id;

        if (!id) {
            return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
        }

        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        const authToken = (await headers()).get('cookie')?.split('authToken=')[1]?.split(';')[0];

        if (!authToken) {
            return NextResponse.json({ error: 'Token not found' }, { status: 401 });
        }

        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;

        const category = await Category.findOne({ _id: id, userId });
        if (!category) {
            return NextResponse.json({ error: 'Category not found or does not belong to user' }, { status: 404 });
        }

        const existingCategory = await Category.findOne({ name, userId, _id: { $ne: id } });
        if (existingCategory) {
            return NextResponse.json({ error: 'Category name already exists' }, { status: 400 });
        }

        category.name = name;
        await category.save();

        return NextResponse.json(category);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const { id } = await params;


        const authToken = (await headers()).get('cookie')?.split('authToken=')[1]?.split(';')[0];

        if (!authToken) {
            return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
        }


        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;


        const category = await Category.findOne({ _id: id, userId });
        if (!category) {
            return NextResponse.json({ error: 'Categoria não encontrada ou não pertence ao usuário' }, { status: 404 });
        }


        await Category.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Categoria deletada com sucesso' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}