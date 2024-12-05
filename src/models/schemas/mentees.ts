import mongoose from 'mongoose';

const menteesSchema = new mongoose.Schema({
    menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' }]
}, { timestamps: true });

const mentee = mongoose.model('Mentee', menteesSchema);
export default mentee;