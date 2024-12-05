"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const menteesSchema = new mongoose_1.default.Schema({
    menteeId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    mentors: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Mentor' }]
}, { timestamps: true });
const mentee = mongoose_1.default.model('Mentee', menteesSchema);
exports.default = mentee;
