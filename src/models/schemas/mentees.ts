import mongoose from 'mongoose';
import { bookmarksSchema } from './bookmarks';

const menteesSchema = new mongoose.Schema({
    menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: bookmarksSchema
}, { timestamps: true });

const mentee = mongoose.model('Mentee', menteesSchema);
export default mentee;