import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ITransaction extends Document {
    _id: Types.ObjectId;
    description: string;
    amount: number;
    currency: string;
    date: Date;
    type: 'expense' | 'income';
    is_fixed: boolean | null;
    recurringGroupId?: string;
    category: Types.ObjectId;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    date: {
        type: Date,
        required: true,
        default: () => new Date(new Date().toISOString().split('T')[0])
    },
    type: { type: String, required: true, enum: ['expense', 'income'] },
    is_fixed: { type: Boolean, default: null },
    recurringGroupId: { type: String, index: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
}, { timestamps: true });

transactionSchema.index({ userId: 1, date: -1 });

const Transaction: Model<ITransaction> =
    mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
