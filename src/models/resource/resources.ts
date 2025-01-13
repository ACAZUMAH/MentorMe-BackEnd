import mongoose from 'mongoose';
import { resourceDocument } from '../../common/interfaces';

const resourceSchema = new mongoose.Schema<resourceDocument>({
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    resources_url: { type: String, required: true },
    forward_to_mentees: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export const resourceModel = mongoose.model('resources', resourceSchema);
 