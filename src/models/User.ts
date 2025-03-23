import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    verificationCode: { type: String }, // Add this field
    selectedTheme: { type: String, default: 'light' },
    currencyId: { type: String, default: 'USD' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);