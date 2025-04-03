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


let cached: MongooseCache = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI!, { bufferCommands: false });
    cached.conn = await mongoose.connect(MONGODB_URI!, { bufferCommands: true });


    return cached.conn;
}
export default dbConnect;