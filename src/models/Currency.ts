import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICurrency extends Document {
    name: string;
    code: string;
}

const CurrencySchema = new Schema<ICurrency>({
    name: { type: String },
    code: { type: String },
}, { strict: false });

const Currency: Model<ICurrency> =
    mongoose.models.Currency || mongoose.model<ICurrency>('Currency', CurrencySchema, 'currencies');

export default Currency;
