import mongoose from 'mongoose';

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    /* eslint-disable no-var, prefer-const */
    var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('❌ MONGODB_URI não está definida nas variáveis de ambiente!');
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

async function dbConnect(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        cached.promise = mongoose.connect(String(MONGODB_URI), opts)
            .then((mongoose) => {
                console.log('✅ MongoDB conectado!');
                return mongoose;
            })
            .catch((err) => {
                console.error('❌ Erro ao conectar no MongoDB:', err);
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
}

// Garantir que a conexão seja fechada quando o aplicativo for encerrado
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB desconectado devido ao encerramento do aplicativo');
    process.exit(0);
});

if (process.env.NODE_ENV !== 'production') {
    global.mongoose = cached;
}


export default dbConnect;