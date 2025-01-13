import mongoose from 'mongoose';
import { bookmarksSchema } from '../bookmark/bookmarks';
import { menteeDocument } from '../../common/interfaces';

const menteesSchema = new mongoose.Schema<menteeDocument>({
    menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: bookmarksSchema
}, { timestamps: true });

export const menteeModel = mongoose.model('Mentee', menteesSchema);
