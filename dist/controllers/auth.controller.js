"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verifyOtp = exports.createuser = void 0;
const services = __importStar(require("../services/users-services/index"));
const verifyAndSend_1 = require("../services/auth-services/verifyAndSend");
const helpers_1 = require("../helpers");
/**
 * controller to create a new user and send otp
 * @param req Request object
 * @param res Response object
 * @returns response message
 */
const createuser = async (req, res) => {
    const { phone, password } = req.body;
    await services.checkUserExists(phone);
    const user = await services.createUser({ phone, password });
    const sent = await (0, verifyAndSend_1.generateOtpAndSendSms)(user._id, phone);
    if (sent) {
        return res.status(201)
            .json({ message: "User created  verify your otp to get authenticated " });
    }
    ;
};
exports.createuser = createuser;
/**
 * controller for verifying otp code and generating access token
 * @param req Request object
 * @param res Response object
 */
const verifyOtp = async (req, res) => {
    const { code } = req.body;
    const token = await (0, verifyAndSend_1.verifyOtpAndGenerateToken)(code);
    return res.status(200).json({ token });
};
exports.verifyOtp = verifyOtp;
/**
 * controller for logging in a user
 * @param req Request object
 * @param res Response object
 */
const login = async (req, res) => {
    const { phone, password } = req.body;
    const user = await services.getUserByPhone(phone);
    const match = await (0, helpers_1.comparePassword)(password, user.password);
    if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    ;
    const token = await (0, helpers_1.generateAccessToken)(user._id);
    return res.status(200).json({ token: token });
};
exports.login = login;
