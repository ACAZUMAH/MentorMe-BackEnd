"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAuthByCodeAndDelete = exports.findAuthAndUpdate = exports.findAuthByCode = exports.createAuth = void 0;
const authSchema_1 = __importDefault(require("../../models/schemas/authSchema"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = require("mongoose");
/**
 * create an auth record with user id to save
 * code and expiration time for verification
 * @param userId user id
 * @returns boolean true
 */
const createAuth = async (userId) => {
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user id');
    }
    ;
    await authSchema_1.default.create({ userId });
    return true;
};
exports.createAuth = createAuth;
/**
 *
 * @param code
 * @returns
 */
const findAuthByCode = async (code) => {
    return await authSchema_1.default.findOne({ code });
};
exports.findAuthByCode = findAuthByCode;
/**
 *
 * @param id
 * @param updateData
 * @returns
 */
const findAuthAndUpdate = async (id, updateData) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user id');
    }
    ;
    return await authSchema_1.default.findOneAndUpdate({ userId: id }, { ...updateData });
};
exports.findAuthAndUpdate = findAuthAndUpdate;
/**
 *
 * @param code
 */
const findAuthByCodeAndDelete = async (code) => {
    if (!(await authSchema_1.default.findOne({ code }))) {
        throw new http_errors_1.default.NotFound('Invalid otp');
    }
    ;
    return await authSchema_1.default.findOneAndDelete({ code });
};
exports.findAuthByCodeAndDelete = findAuthByCodeAndDelete;
