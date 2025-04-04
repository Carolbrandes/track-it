import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    selectedTheme: string;
    currencyId: string;
    verificationCode: string
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    selectedTheme: { type: String, default: 'light' },
    currencyId: { type: String, required: true },
    verificationCode: { type: String, required: true, default: '' },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;