// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import Category from '../../../models/Category';
import dbConnect from '../../lib/db';

export async function GET() {
    try {
        await dbConnect();
        const categories = await Category.find({}).sort({ createdAt: -1 });
        return NextResponse.json(categories);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        await dbConnect();
        const { name } = await request.json();

        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return NextResponse.json(
                { error: 'Category already exists' },
                { status: 400 }
            );
        }

        const newCategory = new Category({ name });
        await newCategory.save();

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

