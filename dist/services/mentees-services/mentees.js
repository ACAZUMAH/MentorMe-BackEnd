"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMentor = exports.getMenteeData = void 0;
const mentees_1 = __importDefault(require("../../models/schemas/mentees"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = require("mongoose");
/**
 * find mentee by id and return it's data with mentors
 * @param id mentee id
 * @returns mentee data with list mentor ids
 * @throws 400 if id is invalid
 */
const getMenteeData = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return new http_errors_1.default.BadRequest('Invalid mentee id');
    }
    ;
    const menteeData = await mentees_1.default.findOne({ menteeId: id });
    if (!menteeData) {
        return new http_errors_1.default.NotFound('No mentors found');
    }
    ;
    return menteeData;
};
exports.getMenteeData = getMenteeData;
/**
 * add mentor id to mentee's mentors list in the database
 * after a mentorship request is accepted
 * @param ids mentor and mentee ids
 * @returns boolean true
 * @throws 400 if id is invalid
 * @throws 404 if no mentee found
 */
const addMentor = async (ids) => {
    if (!mongoose_1.Types.ObjectId.isValid(ids.mentorId) ||
        !mongoose_1.Types.ObjectId.isValid(ids.menteeId)) {
        return new http_errors_1.default.BadRequest('Invalid mentor or mentee id');
    }
    ;
    const menteeData = await mentees_1.default.findOneAndUpdate({ menteeId: ids.menteeId }, { $push: { mentors: ids.mentorId } }, { new: true });
    if (!menteeData) {
        await mentees_1.default.create({ menteeId: ids.menteeId, mentors: [ids.mentorId] });
    }
    ;
    return true;
};
exports.addMentor = addMentor;
