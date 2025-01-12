import mongoose, { Types } from 'mongoose';
import { messagesSchema } from './mesageSchema';

const messageSchema = new mongoose.Schema({
    messagesIds: { type: String, required: true },
    messages: [messagesSchema]
})

export const messageModel = mongoose.model('messages', messageSchema);