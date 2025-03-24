import mongoose from 'mongoose';

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Initialize the cached variable with the correct type
let cached: MongooseCache = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
    if (cached.conn) {
        console.log("🚀 Conexão reutilizada!");
        return cached.conn;
    }

    console.log("🚀 Criando nova conexão...");
    await mongoose.disconnect(); // Fecha conexões antigas

    cached.conn = await mongoose.connect(MONGODB_URI!, { bufferCommands: false });
    console.log("🚀 Conectado ao MongoDB!");

    return cached.conn;
}
export default dbConnect;