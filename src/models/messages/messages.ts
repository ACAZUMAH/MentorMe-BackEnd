import mongoose, { Types } from 'mongoose';
import { messagesSchema } from './mesageSchema';
import { messageDocument } from '../../common/interfaces';

const messageSchema = new mongoose.Schema<messageDocument>({
    messagesIds: { type: String, required: true },
    messages: [messagesSchema]
})

export const messageModel = mongoose.model('messages', messageSchema);