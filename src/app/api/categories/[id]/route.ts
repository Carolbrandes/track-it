import { NextResponse } from 'next/server';
import Category from '../../../../models/Category';
import dbConnect from '../../../lib/db';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { name } = await request.json();
        const { id } = params;

        // Check if new name already exists
        const existingCategory = await Category.findOne({ name, _id: { $ne: id } });
        if (existingCategory) {
            return NextResponse.json(
                { error: 'Category name already exists' },
                { status: 400 }
            );
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );

        if (!updatedCategory) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedCategory);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { id } = params;

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}