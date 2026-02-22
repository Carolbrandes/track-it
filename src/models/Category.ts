import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ICategory extends Document {
    _id: Types.ObjectId;
    name: string;
    createdAt: Date;
    userId: Types.ObjectId;
}

const CategorySchema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Category: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
