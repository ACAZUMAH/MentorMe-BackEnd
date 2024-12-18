import mongoose, { Types } from 'mongoose';
import messagesSchema from './mesages';

const messageSchema = new mongoose.Schema({
    messagesIds: { type: String, required: true },
    messages: [messagesSchema]
})

const message = mongoose.model('messages', messageSchema)

export default message; 