import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    verificationCode: { type: String },
    selectedTheme: { type: String, default: 'light' },
    currencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', default: '67e12322a2f7b8353bceb3f6' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);