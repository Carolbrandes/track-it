// middleware.ts
import { jwtVerify } from 'jose'; // Substitua jsonwebtoken por jose
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

    console.log(`🚀 ~ middleware ~ Rota: ${pathname}, Token: ${token ? 'presente' : 'ausente'}`);

    const protectedRoutes = ['/', '/add-transaction', '/categories', '/graphics'];

    if (protectedRoutes.includes(pathname)) {
        if (!token) {
            console.log('🚀 ~ Redirecionando para /login - Token ausente');
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            // ✅ Verificação do token usando jose (compatível com Edge Runtime)
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(process.env.JWT_SECRET!) // Chave deve ser um Uint8Array
            ) as { payload: JwtPayload };

            console.log('🚀 ~ Token válido para usuário:', payload.userId);

            // Clone da requisição e adição de headers
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-user-id', payload.userId);

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
        } catch (error) {
            console.log('🚀 ~ Token inválido:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/categories',
        '/graphics',
    ],
};