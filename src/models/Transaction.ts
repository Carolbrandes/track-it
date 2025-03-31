import { Schema, model, models } from 'mongoose';

const transactionSchema = new Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    date: {
        type: Date,
        required: true,
        default: () => new Date(new Date().toISOString().split('T')[0]) // Ensure stored in UTC
    },
    type: { type: String, required: true, enum: ['expense', 'income'] },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
}, { timestamps: true });

// ✅ Fix: Use `models.Transaction` if it exists to prevent overwriting
export default models.Transaction || model('Transaction', transactionSchema);