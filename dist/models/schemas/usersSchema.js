"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const usersSchema = new mongoose_1.default.Schema({
    fullName: { type: String, maxLength: 100 },
    profile_url: { type: String },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    role: { type: String },
    programmeOfStudy: { type: String },
    level: { type: String },
    about: { type: String, maxlength: 250 },
    acadamicFields: { type: String },
    password: { type: String, required: true },
    isAuthenticated: { type: Boolean, default: false }
}, { timestamps: true });
const User = mongoose_1.default.model('User', usersSchema);
exports.default = User;
