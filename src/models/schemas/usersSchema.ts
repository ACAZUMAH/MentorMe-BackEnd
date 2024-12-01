import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    fullName: { type: String, maxLength: 100 },
    profile_url: { type: String },

    role: { type: String },
    programmeOfStudy: { type: String },
    level: { type: String },
    about: { type: String, maxlength: 250},
    acadamicFields: { type: String },
    password: { type: String  },
    isAuthenticated: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', usersSchema);

export default User;