import mongoose from 'mongoose';

const messagesSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    message: { type: String, required: true },
    delivered: { type: Boolean, default: false }
});

export default messagesSchema;