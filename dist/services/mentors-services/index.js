"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMentorMentee = exports.getAllMentorsAndMentees = void 0;
const usersSchema_1 = __importDefault(require("../../models/schemas/usersSchema"));
const filter_1 = __importDefault(require("../filters/filter"));
/**
 * find a user from the databaase by role and filter
 *  by fullName, programmeOfStudy, level and sort them
 * @param query query object
 * @returns result of the query
 */
const getAllMentorsAndMentees = async (query) => {
    const { page, limit } = query;
    let result = await (0, filter_1.default)(query, usersSchema_1.default);
    const pages = Number(page) || 1;
    const limits = Number(limit) || 10;
    const skip = (pages - 1) * limits;
    result = result.skip(skip).limit(limits);
    return await result;
};
exports.getAllMentorsAndMentees = getAllMentorsAndMentees;
const getMentorMentee = async (id) => {
};
exports.getMentorMentee = getMentorMentee;
