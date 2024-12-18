"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectionIdsSchema = new mongoose_1.default.Schema({
    userId: { type: String, ref: 'User', required: true },
    socketId: { type: String, required: true }
});
const connectionIds = mongoose_1.default.model('socketIds', connectionIdsSchema);
exports.default = connectionIds;
