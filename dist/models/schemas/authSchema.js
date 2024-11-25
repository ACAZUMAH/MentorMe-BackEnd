"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const authSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true },
    code: { type: String },
    expiresIn: { type: Date },
}, { timestamps: true });
const Auth = mongoose_1.default.model('Auth', authSchema);
exports.default = Auth;
