import mongoose from 'mongoose';

const CurrencySchema = new mongoose.Schema({
    name: { type: String },
    code: { type: String },
}, { strict: false });

export default mongoose.models.Currency || mongoose.model('Currency', CurrencySchema, 'currencies');