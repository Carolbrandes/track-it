import mongoose from 'mongoose';

declare global {
    // eslint-disable-next-line no-var
    var mongoose: any;
}

const MONGODB_URI = process.env.MONGODB_URI;

console.log('MONGODB_URI:', process.env.MONGODB_URI);

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise && MONGODB_URI) {
        console.log('Connecting to MongoDB...'); // Debugging
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            console.log('Connected to MongoDB'); // Debugging
            return mongoose;
        }).catch((error) => {
            console.error('MongoDB connection error:', error); // Debugging
            throw error;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;