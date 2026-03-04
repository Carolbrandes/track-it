import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ICategory extends Document {
    _id: Types.ObjectId;
    name: string;
    createdAt: Date;
    userId: Types.ObjectId;
}

const CategorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

CategorySchema.index({ name: 1, userId: 1 }, { unique: true });

const Category: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
