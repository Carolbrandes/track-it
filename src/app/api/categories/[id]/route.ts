import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Category from '../../../../models/Category';
import dbConnect from '../../../lib/db';
import { formatZodError, updateCategorySchema } from '../../../lib/validations';

async function getAuthToken(): Promise<string | null> {
    const h = await headers();
    const tokenFromCookie = h.get('cookie')?.split('authToken=')[1]?.split(';')[0];
    if (tokenFromCookie) return tokenFromCookie;
    const authHeader = h.get('authorization');
    if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
    return null;
}

export async function PUT(request: NextRequest) {
    try {
        await dbConnect();

        // Pegando o ID diretamente da URL
        const id = request.nextUrl.pathname.split('/').pop();
        if (!id) {
            return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
        }

        const body = await request.json();
        const parseResult = updateCategorySchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({ error: formatZodError(parseResult.error) }, { status: 400 });
        }

        const { name } = parseResult.data;

        const authToken = await getAuthToken();
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

        const authToken = await getAuthToken();
        if (!authToken) {
            return NextResponse.json({ error: 'Token not found' }, { status: 401 });
        }

        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;

        const category = await Category.findOne({ _id: id, userId });
        if (!category) {
            return NextResponse.json({ error: 'Category not found or does not belong to user' }, { status: 404 });
        }
        await Category.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete category';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}