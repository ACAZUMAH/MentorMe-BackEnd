import mongoose, { Types } from 'mongoose';

const connectionIdsSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true },
    socketId: { type: String, required: true }
});

const connectionIds = mongoose.model('socketIds', connectionIdsSchema);

export default connectionIds; 