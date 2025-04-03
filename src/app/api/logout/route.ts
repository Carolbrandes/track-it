import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true, message: 'Logged out' });

    // Remove the cookie of authToken on logout
    response.cookies.set('authToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', //!TODO: set "secure" for production
        maxAge: -1, // Define a expiration in the past to remove the cookie
        path: '/', // the cookie must  be disponible in all  site
    });

    return response;
}