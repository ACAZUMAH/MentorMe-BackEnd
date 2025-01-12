import mongoose from 'mongoose';
import { bookmarksSchema } from '../bookmark/bookmarks';

const menteesSchema = new mongoose.Schema({
    menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: bookmarksSchema
}, { timestamps: true });

export const menteeModel = mongoose.model('Mentee', menteesSchema);
