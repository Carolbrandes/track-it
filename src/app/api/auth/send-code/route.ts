import User from '@/models/User';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dbConnect from '../../../lib/db';

export async function POST(req: Request) {
    await dbConnect();
    const { email } = await req.json();

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated verification code:', code); // Debugging

    // Check if the user exists, or create a new user
    let user = await User.findOne({ email });

    if (!user) {
        console.log('User does not exist. Creating a new user...'); // Debugging
        user = await User.create({
            email,
            verificationCode: code, // Save the verification code
            selectedTheme: 'light', // Default theme
            currencyId: 'USD', // Default currency
        });
    } else {
        // Update the verification code for existing users
        user.verificationCode = code;
        await user.save();
    }

    console.log('User after update/creation:', user); // Debugging

    // Send the code via email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Track It" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is ${code}.`,
    });

    return NextResponse.json({ success: true });
}