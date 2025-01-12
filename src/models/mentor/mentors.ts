import mongoose from 'mongoose';

const mentorschema = new mongoose.Schema({
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export const mentorModel = mongoose.model('Mentor', mentorschema);
