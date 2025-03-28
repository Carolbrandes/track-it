import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    date: { type: Date, required: true, default: Date.now },
    type: { type: String, required: true, enum: ['expense', 'income'] },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
}, { timestamps: true });

export default model('Transaction', transactionSchema);