import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expiresIn: { type: Date, required: true },
}, { timestamps: true });

export const authModel = mongoose.model('Auth', authSchema);
