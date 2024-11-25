"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpAndGenerateToken = exports.generateOtpAndSendSms = void 0;
const index_1 = require("./index");
const http_errors_1 = __importDefault(require("http-errors"));
const users_services_1 = require("../users-services");
const helpers_1 = require("../../helpers");
/**
 * generate otp and send sms to the user
 * @param id user's id
 * @param phone user's phone number
 * @returns boolean true
 */
const generateOtpAndSendSms = async (id, phone) => {
    let otp = await (0, helpers_1.generateOTP)(6);
    while (await (0, index_1.findAuthByCode)(otp)) {
        otp = await (0, helpers_1.generateOTP)(6);
    }
    ;
    const ExpiresIn = new Date(Date.now() + 1 * 60 * 1000);
    await (0, index_1.findAuthAndUpdate)(id, { code: otp, expiresIn: ExpiresIn });
    const sms = `Your verification code is: ${otp}`;
    //await sendSms(phone, sms);
    return true;
};
exports.generateOtpAndSendSms = generateOtpAndSendSms;
/**
 * verify otp code and generate access token
 * @param code otp code
 * @returns access token
 * @throws 400 if otp is invalid
 */
const verifyOtpAndGenerateToken = async (code) => {
    const auth = await (0, index_1.findAuthByCodeAndDelete)(code);
    if (Date.now() > auth.ExpiresIn) {
        throw new http_errors_1.default.BadRequest('otp expired');
    }
    ;
    await (0, users_services_1.finduserByIdAndUpdateIsAuth)(auth.userId);
    return (0, helpers_1.generateAccessToken)(auth.userId);
};
exports.verifyOtpAndGenerateToken = verifyOtpAndGenerateToken;
