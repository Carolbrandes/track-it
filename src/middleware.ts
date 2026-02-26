import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

interface JwtPayload {
    userId: string;
    iat: number;
    exp: number;
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken')?.value;
    const { pathname } = request.nextUrl;



    const protectedRoutes = ['/', '/add-transaction', '/categories', '/financial-analytics', '/my-data'];

    if (protectedRoutes.includes(pathname)) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(process.env.JWT_SECRET!)
            ) as { payload: JwtPayload };


            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-user-id', payload.userId);

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
        } catch (error) {
            console.error('🚀 ~ Token inválido:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/add-transaction',
        '/categories',
        '/financial-analytics',
        '/my-data',
    ],
};