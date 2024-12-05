import mongoose from "mongoose";

const mentorshipRequestSchema = new mongoose.Schema({
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'pending' }
}, { timestamps: true });

const mentorshipRequest = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
export default mentorshipRequest;