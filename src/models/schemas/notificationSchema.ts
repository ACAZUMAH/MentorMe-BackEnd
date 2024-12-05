import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    status: { type: String, default: 'unread' }
} , { timestamps: true });   