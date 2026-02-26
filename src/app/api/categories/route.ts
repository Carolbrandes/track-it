import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Category from '../../../models/Category';
import dbConnect from '../../lib/db';
import { invalidateInsightsCache } from '../../lib/invalidateInsightsCache';
import { createCategorySchema, formatZodError } from '../../lib/validations';

async function getAuthToken(): Promise<string | null> {
    const h = await headers();
    const tokenFromCookie = h.get('cookie')?.split('authToken=')[1]?.split(';')[0];
    if (tokenFromCookie) return tokenFromCookie;
    const authHeader = h.get('authorization');
    if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
    return null;
}

export async function GET() {
    try {
        await dbConnect();

        const authToken = await getAuthToken();
        if (!authToken) {
            return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
        }

        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userId = payload.userId;

        const categories = await Category.find({ userId }).sort({ createdAt: -1 });

        return NextResponse.json(categories);
    } catch (error: unknown) {
        let errorMessage = 'Failed on operation';

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const parseResult = createCategorySchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({ error: formatZodError(parseResult.error) }, { status: 400 });
        }

        const { name } = parseResult.data;

        const authToken = await getAuthToken();
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
        await invalidateInsightsCache(userId as string);
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error: unknown) {
        let errorMessage = 'Failed on operation';

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

