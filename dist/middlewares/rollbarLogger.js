"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rollbar_1 = __importDefault(require("rollbar"));
const rollbar = new rollbar_1.default({
    accessToken: "533d47cb05d8481e9e0b3edc416992bc",
    captureUncaught: true,
    captureUnhandledRejections: true,
});
exports.default = rollbar;
