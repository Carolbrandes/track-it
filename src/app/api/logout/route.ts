// Exemplo de API no Next.js para fazer logout

import { NextResponse } from 'next/server';

export async function POST(req) {
    const response = NextResponse.json({ success: true, message: 'Logged out' });

    // Remover o cookie authToken no logout
    response.cookies.set('authToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Só "secure" se for produção
        maxAge: -1, // Definir a expiração no passado para remover o cookie
        path: '/', // O cookie deve estar disponível em todo o site
    });

    return response;
}