import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Category from '../../../../models/Category';
import dbConnect from '../../../lib/db';

export async function PUT(request: NextRequest) {
    try {
        await dbConnect();

        // Pegando o ID diretamente da URL
        const id = request.nextUrl.pathname.split('/').pop();
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
        // @ts-expect-error: Ignoring union type compatibility issue with findById method
        const category = await Category.findOne({ _id: id, userId });
        if (!category) {
            return NextResponse.json({ error: 'Category not found or does not belong to user' }, { status: 404 });
        }
        // @ts-expect-error: Ignoring union type compatibility issue with findById method
        const existingCategory = await Category.findOne({ name, userId, _id: { $ne: id } });
        if (existingCategory) {
            return NextResponse.json({ error: 'Category name already exists' }, { status: 400 });
        }

        category.name = name;
        await category.save();

        return NextResponse.json(category);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update category';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await dbConnect();

        // Pegando o ID diretamente da URL
        const id = request.nextUrl.pathname.split('/').pop();
        if (!id) {
            return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
        }

        const authToken = (await headers()).get('cookie')?.split('authToken=')[1]?.split(';')[0];
        if (!authToken) {
            return NextResponse.json({ error: 'Token not found' }, { status: 401 });
        }

        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;

        // @ts-expect-error: Ignoring union type compatibility issue with findById method
        const category = await Category.findOne({ _id: id, userId });
        if (!category) {
            return NextResponse.json({ error: 'Category not found or does not belong to user' }, { status: 404 });
        }
        // @ts-expect-error: Ignoring union type compatibility issue with findById method
        await Category.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete category';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}