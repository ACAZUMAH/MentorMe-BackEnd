"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mesages_1 = __importDefault(require("./mesages"));
const messageSchema = new mongoose_1.default.Schema({
    messagesIds: { type: String, required: true },
    messages: [mesages_1.default]
});
const message = mongoose_1.default.model('messages', messageSchema);
exports.default = message;
