import User from '@/models/User';
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';


export async function POST(req: Request) {
    await dbConnect();

    // Log the request body for debugging
    const body = await req.json();
    console.log('Request body:', body);

    const { email, code } = body;

    if (!email || !code) {
        return NextResponse.json(
            { success: false, message: 'Email and code are required' },
            { status: 400 }
        );
    }

    // Log the email and code being checked
    console.log('Checking verification code for email:', email);
    console.log('Verification code:', code);

    // Find the user by email
    const user = await User.findOne({ email });
    console.log('User from database:', user); // Debugging

    if (!user) {
        console.log('User not found for email:', email); // Debugging
        return NextResponse.json(
            { success: false, message: 'User not found' },
            { status: 400 }
        );
    }

    // Log the verification code stored in the database
    console.log('Stored verification code:', user.verificationCode); // Debugging

    // Check if the verification code matches
    if (user.verificationCode !== code) {
        console.log('Invalid code for email:', email); // Debugging
        return NextResponse.json(
            { success: false, message: 'Invalid code' },
            { status: 400 }
        );
    }

    // Clear the verification code (optional)
    user.verificationCode = undefined;
    await user.save();

    // Create a response object
    const response = NextResponse.json({ success: true });

    // Set the authToken cookie
    response.cookies.set('authToken', user._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });

    return response;
}