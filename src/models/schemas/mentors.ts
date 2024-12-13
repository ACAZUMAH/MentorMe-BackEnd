import mongoose from 'mongoose';

const mentorschema = new mongoose.Schema({
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const mentor = mongoose.model('Mentor', mentorschema);
export default mentor;