"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMentee = exports.getMentorData = void 0;
const mentors_1 = __importDefault(require("../../models/schemas/mentors"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = require("mongoose");
/**
 * find mentor by id and return it's data with mentees
 * @param id mentor id
 * @returns mentor data with list of mentee ids
 */
const getMentorData = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return new http_errors_1.default.BadRequest('Invalid mentor id');
    }
    ;
    const mentorData = await mentors_1.default.findOne({ mentorId: id });
    if (!mentorData) {
        return new http_errors_1.default.NotFound('No mentees found');
    }
    ;
    return mentorData;
};
exports.getMentorData = getMentorData;
/**
 * add mentee id to mentor's mentees list in the database
 * @param ids mentor and mentee ids
 * @returns boolean true
 * @throws 400 if id is invalid
 * @throws 404 if no mentor found
 */
const addMentee = async (ids) => {
    if (!mongoose_1.Types.ObjectId.isValid(ids.mentorId) ||
        !mongoose_1.Types.ObjectId.isValid(ids.menteeId)) {
        return new http_errors_1.default.BadRequest('Invalid mentor or mentee id');
    }
    ;
    const mentorData = await mentors_1.default.findOneAndUpdate({ mentorId: ids.mentorId }, { $push: { mentees: ids.menteeId } }, { new: true });
    if (!mentorData) {
        await mentors_1.default.create({ mentorId: ids.mentorId, mentees: [ids.menteeId] });
    }
    ;
    return true;
};
exports.addMentee = addMentee;
