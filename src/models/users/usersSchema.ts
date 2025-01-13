import mongoose from "mongoose";
import { userDocument } from "../../common/interfaces";

const usersSchema = new mongoose.Schema<userDocument>({
    fullName: { type: String, maxLength: 100 },
    profile_url: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    role: { type: String },
    programmeOfStudy: { type: String },
    level: { type: String },
    about: { type: String, maxlength: 250},
    acadamicFields: [{ type: String }],
    password: { type: String  },
    isAuthenticated: { type: Boolean, default: false }
}, { timestamps: true });

export const userModel = mongoose.model('User', usersSchema);

