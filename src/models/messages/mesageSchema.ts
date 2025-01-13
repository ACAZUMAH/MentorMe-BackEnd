import mongoose from 'mongoose';
import { message } from '../../common/interfaces';

export const messagesSchema = new mongoose.Schema<message>({
    senderId: { type: String, required: true },
    message: { type: String, required: true },
    delivered: { type: Boolean, default: false }
}, { timestamps: true });
