"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenBlacklisted = exports.blacklistToken = void 0;
const redis_1 = __importDefault(require("../../models/connect/redis"));
/**
 * add a token to the blacklist
 * @param token token to be blacklisted
 */
const blacklistToken = async (token) => {
    await redis_1.default.setEx('blacklisted', 3600 * 24, token);
};
exports.blacklistToken = blacklistToken;
/**
 * check if a token is blacklisted
 * @param token token to be checked
 * @returns boolean
 */
const isTokenBlacklisted = async (token) => {
    const result = await redis_1.default.get('blacklisted');
    return result === token;
};
exports.isTokenBlacklisted = isTokenBlacklisted;
