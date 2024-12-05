"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const sendSms = async (phone, message) => {
    const phoneFormat = phone.replace('+', '');
    const url = process.env.SMS_API_URL;
    const apiKey = process.env.SMS_API_KEY;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "key": apiKey,
            "msisdn": `${phoneFormat}, 233xxxxxxxx`,
            "message": message,
            "sender_id": "MentorMe",
        })
    });
    if (!response.ok) {
        throw new http_errors_1.default.BadGateway('Failed to send sms');
    }
    return true;
};
exports.default = sendSms;
