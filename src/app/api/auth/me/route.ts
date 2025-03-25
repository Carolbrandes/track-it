import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import dbConnect from '../../../lib/db';

export async function GET(req: Request) {
    await dbConnect();

    // 🔥 get token o request
    const authToken = req.headers.get('cookie')?.split('; ').find(c => c.startsWith('authToken='))?.split('=')[1];

    if (!authToken) {
        return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    // 🔎 search for user in db
    const user = await User.findById(authToken);

    if (!user) {
        return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    return NextResponse.json({ isLoggedIn: true, user });
}