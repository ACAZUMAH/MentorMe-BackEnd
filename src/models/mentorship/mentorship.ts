import mongoose from "mongoose";
import { mentorshipDocument } from "../../common/interfaces";

const mentorshipRequestSchema = new mongoose.Schema<mentorshipDocument>({
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'pending' }
}, { timestamps: true });

export const mentorshipModel = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
