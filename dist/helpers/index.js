"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = exports.generateAccessToken = exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 *
 * @param password
 * @returns
 */
const hashPassword = async (password) => {
    const salt = await bcrypt_1.default.genSalt(10);
    return await bcrypt_1.default.hash(password, salt);
};
exports.hashPassword = hashPassword;
/**
 *
 * @param password
 * @param hash
 */
const comparePassword = async (password, hash) => {
    return await bcrypt_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
/**
 *
 * @param id
 * @returns
 */
const generateAccessToken = async (id) => {
    const payload = { id };
    return jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "50d", });
};
exports.generateAccessToken = generateAccessToken;
/**
 * generate a random otp of a given length for verification
 * @param len length of the otp
 * @returns otp code
 */
const generateOTP = async (len) => {
    const digits = "0123456789";
    const Length = digits.length;
    let otp = "";
    for (let i = 0; i < len; i++) {
        otp += digits.charAt(Math.floor(Math.random() * Length));
    }
    return otp;
};
exports.generateOTP = generateOTP;
