import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    code: { type: String },
    expiresIn: { type: Date },
}, { timestamps: true });

const Auth = mongoose.model('Auth', authSchema);

export default Auth;