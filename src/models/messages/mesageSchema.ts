import mongoose from 'mongoose';

export const messagesSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    message: { type: String, required: true },
    delivered: { type: Boolean, default: false }
}, { timestamps: true });
