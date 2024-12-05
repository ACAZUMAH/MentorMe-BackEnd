"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mentorshipRequestSchema = new mongoose_1.default.Schema({
    mentorId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    menteeId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'pending' }
}, { timestamps: true });
const mentorshipRequest = mongoose_1.default.model('MentorshipRequest', mentorshipRequestSchema);
exports.default = mentorshipRequest;
