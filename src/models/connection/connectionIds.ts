import mongoose, { Types } from 'mongoose';

const connectionIdsSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true },
    socketId: { type: String, required: true }
});

export const connectionIdsModel  = mongoose.model('socketIds', connectionIdsSchema);

  