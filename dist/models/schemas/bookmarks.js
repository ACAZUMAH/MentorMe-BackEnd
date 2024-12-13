"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarksSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.bookmarksSchema = new mongoose_1.default.Schema({
    resourcesIds: [{ type: mongoose_1.default.Types.ObjectId }]
});
