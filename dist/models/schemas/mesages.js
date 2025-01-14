"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messagesSchema = new mongoose_1.default.Schema({
    senderId: { type: String, required: true },
    message: { type: String, required: true },
    delivered: { type: Boolean, default: false }
}, { timestamps: true });
exports.default = messagesSchema;
