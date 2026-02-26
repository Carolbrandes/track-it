import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IInsightsCache extends Document {
    userId: Types.ObjectId;
    locale: string;
    data: Record<string, unknown>;
    expiresAt: Date;
}

const InsightsCacheSchema = new Schema<IInsightsCache>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        locale: { type: String, required: true, default: 'pt' },
        data: { type: Schema.Types.Mixed, required: true },
        expiresAt: { type: Date, required: true },
    },
    { collection: 'insightscaches' }
);

// TTL: MongoDB remove documentos automaticamente quando expiresAt passa
InsightsCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
InsightsCacheSchema.index({ userId: 1, locale: 1 }, { unique: true });

const InsightsCache: Model<IInsightsCache> =
    mongoose.models.InsightsCache || mongoose.model<IInsightsCache>('InsightsCache', InsightsCacheSchema);

export default InsightsCache;
