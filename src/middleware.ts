import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('authToken');

    // Define routes that require authentication
    const protectedRoutes = ['/', '/transactions', '/add-transaction', '/categories', 'add-category', '/graphics'];

    // Redirect unauthenticated users to /login
    if (!authToken && protectedRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect authenticated users away from /login
    if (authToken && request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/transactions',
        '/categories',
        '/graphics',
        '/login',
    ],
};