import mongoose from "mongoose";
import { authDocument } from "../../common/interfaces";

const authSchema = new mongoose.Schema<authDocument>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expiresIn: { type: Date, required: true },
}, { timestamps: true });

export const authModel = mongoose.model('Auth', authSchema);
