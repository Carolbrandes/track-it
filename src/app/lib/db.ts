/* eslint-disable prefer-const */
/* eslint-disable no-var */
import mongoose from 'mongoose';

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Evita recriar a conexão no modo hot-reload do Next.js
declare global {
    var mongoose: MongooseCache;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('❌ MONGODB_URI não está definida nas variáveis de ambiente!');
}

// Reutiliza a conexão no hot-reload do Next.js
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

async function dbConnect(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(String(MONGODB_URI), {
            bufferCommands: false, // ✅ Essa opção ainda é válida
        }).then((mongoose) => {
            console.log('✅ MongoDB conectado!');
            return mongoose;
        }).catch((err) => {
            console.error('❌ Erro ao conectar no MongoDB:', err);
            throw err;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

global.mongoose = cached;

export default dbConnect;