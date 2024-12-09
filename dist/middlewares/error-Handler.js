"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
/**
 * catch all errors and return a custom error message
 * @param err error object
 * @param req Request object
 * @param res REsponse object
 * @param next next function
 */
const errorHandler = (err, req, res, next) => {
    console.log(err);
    if (err instanceof http_errors_1.default.HttpError) {
        return res.status(err.statusCode).json({ errors: [{ message: err.message }] });
    }
    return res.status(500).json({ errors: [{ message: 'Internal Server Error' }] });
};
exports.default = errorHandler;
