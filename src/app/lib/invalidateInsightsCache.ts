import mongoose from 'mongoose';
import dbConnect from './db';
import InsightsCache from '@/models/InsightsCache';

/**
 * Remove o cache de insights do usuário. Chamar após criar/editar/remover
 * transação ou categoria para que a próxima geração de insights seja nova.
 */
export async function invalidateInsightsCache(userId: string): Promise<void> {
    try {
        await dbConnect();
        const uid = new mongoose.Types.ObjectId(userId);
        await InsightsCache.deleteMany({ userId: uid });
    } catch (err) {
        console.warn('[invalidateInsightsCache] Failed to invalidate:', err);
    }
}
