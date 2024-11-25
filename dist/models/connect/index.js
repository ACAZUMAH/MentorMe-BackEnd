"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Connect to the database
const connectDB = async (url) => {
    await mongoose_1.default.connect(url, {});
    return true;
};
exports.default = connectDB;
