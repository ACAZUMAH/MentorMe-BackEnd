"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mentorschema = new mongoose_1.default.Schema({
    mentorId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    mentees: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Mentee' }]
});
const mentor = mongoose_1.default.model('Mentor', mentorschema);
exports.default = mentor;
