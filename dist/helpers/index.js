"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterResources = exports.filterQuery = exports.generateOTP = exports.verifySocketToken = exports.verifyAccessToken = exports.generateAccessToken = exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const blacklist_1 = require("../services/blacklistedTokens/blacklist");
const http_errors_1 = __importDefault(require("http-errors"));
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
    return jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" });
};
exports.generateAccessToken = generateAccessToken;
/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
const verifyAccessToken = async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        throw new http_errors_1.default.Forbidden("Forbidden");
    }
    ;
    if (await (0, blacklist_1.isTokenBlacklisted)(token)) {
        throw new http_errors_1.default.Unauthorized('Unauthorized');
    }
    ;
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            throw new http_errors_1.default.Unauthorized("Unauthorized");
        }
        req.user = user;
        next();
    });
};
exports.verifyAccessToken = verifyAccessToken;
/**
 *
 * @param socket
 * @param next
 */
const verifySocketToken = async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        throw new http_errors_1.default.Forbidden('Forbidden');
    }
    ;
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            throw new http_errors_1.default.Unauthorized('Unauthorized');
        }
        ;
        socket.user = user;
        next();
    });
};
exports.verifySocketToken = verifySocketToken;
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
/**
 * filter users by role, fullName, programmeOfStudy, level and sort them
 * @param query query object
 * @returns filtered users
 */
const filterQuery = async (query) => {
    const { role, fullName, programmeOfStudy, level } = query;
    const queryObject = {};
    if (role)
        queryObject.role = role;
    if (fullName)
        queryObject.fullName = { $regex: fullName, $options: "i" };
    if (programmeOfStudy)
        queryObject.programmeOfStudy = { $regex: programmeOfStudy, $options: "i" };
    if (level)
        queryObject.level = level;
    return queryObject;
};
exports.filterQuery = filterQuery;
/**
 *
 * @param query
 * @returns
 */
const filterResources = async (query) => {
    const { title } = query;
    const queryObject = {};
    if (title) {
        queryObject.title = { $regex: title, $options: "i" };
    }
    return queryObject;
};
exports.filterResources = filterResources;
