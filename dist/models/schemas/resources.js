"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const resourceSchema = new mongoose_1.default.Schema({
    uploadedBy: { type: mongoose_1.default.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    resources_url: { type: String, required: true },
    forward_to_mentees: [{ type: mongoose_1.default.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
const resources = mongoose_1.default.model('resources', resourceSchema);
exports.default = resources;
