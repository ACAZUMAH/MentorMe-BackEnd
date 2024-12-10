"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllRequest = exports.CancelRequest = exports.rejectRequest = exports.acceptRequest = exports.findRequests = exports.requestMentorship = void 0;
const mentorshipRequest_1 = __importDefault(require("../../models/schemas/mentorshipRequest"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = require("mongoose");
/**
 * create a mentorship request to a mentor by mentee
 * @param ids mentor and mentee ids
 * @returns requested mentorship
 * @throws 400 if id is invalid
 */
const requestMentorship = async (ids) => {
    if (mongoose_1.Types.ObjectId.isValid(ids.mentorId) &&
        mongoose_1.Types.ObjectId.isValid(ids.menteeId)) {
        const request = mentorshipRequest_1.default.create({
            ...ids,
        });
        return request;
    }
    throw new http_errors_1.default.BadRequest("Invalid mentor or mentee id");
};
exports.requestMentorship = requestMentorship;
/**
 * find a list of mentorship requests made by a mentee by either mentor or mentee id
 * @param id mentee id or mentor id
 * @returns list of mentorship requests
 */
const findRequests = async (id, page) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new http_errors_1.default.BadRequest("Invalid mentee id");
    }
    let result = mentorshipRequest_1.default.find({ $or: [{ menteeId: id }, { mentorId: id }] });
    result = result.sort("createdAt");
    const pages = Number(page) || 1;
    const limit = 10;
    const skip = (pages - 1) * limit;
    result = result.skip(skip).limit(limit);
    return await result;
};
exports.findRequests = findRequests;
/**
 * find a request by mentor and mentee id and accept the request
 * @param ids mentor and mentee ids
 * @returns accepted request
 */
const acceptRequest = async (ids) => {
    if (!mongoose_1.Types.ObjectId.isValid(ids.mentorId) ||
        !mongoose_1.Types.ObjectId.isValid(ids.menteeId)) {
        throw new http_errors_1.default.BadRequest("Invalid mentor or mentee id");
    }
    const request = await mentorshipRequest_1.default.findOneAndUpdate({ mentorId: ids.mentorId, menteeId: ids.menteeId }, { status: "accepted" }, { new: true });
    if (!request) {
        throw new http_errors_1.default.NotFound("No request found");
    }
    return request;
};
exports.acceptRequest = acceptRequest;
/**
 * find a request by mentor and mentee id and reject the request
 * @param ids mentor and mentee ids
 * @returns rejected request
 */
const rejectRequest = async (ids) => {
    if (!mongoose_1.Types.ObjectId.isValid(ids.mentorId) ||
        !mongoose_1.Types.ObjectId.isValid(ids.menteeId)) {
        throw new http_errors_1.default.BadRequest("Invalid mentor or mentee id");
    }
    const request = await mentorshipRequest_1.default.findOneAndUpdate({ mentorId: ids.mentorId, menteeId: ids.menteeId }, { status: "rejected" }, { new: true });
    if (!request) {
        throw new http_errors_1.default.NotFound("No request found");
    }
    return request;
};
exports.rejectRequest = rejectRequest;
/**
 * delete mentorship request from the database when a request is canceled
 * @param menteeId mentee's id
 * @param requestId id of the request to be canceled
 * @returns canceled request
 */
const CancelRequest = async (menteeId, requestId) => {
    if (!mongoose_1.Types.ObjectId.isValid(menteeId) || !mongoose_1.Types.ObjectId.isValid(requestId)) {
        throw new http_errors_1.default.BadRequest("Invalid user or request id");
    }
    const cancel = await mentorshipRequest_1.default.findByIdAndDelete({
        _id: requestId,
        menteeId,
    });
    if (!cancel) {
        throw new http_errors_1.default.BadRequest("No request found");
    }
    return cancel;
};
exports.CancelRequest = CancelRequest;
/**
 * delete all requests by provided mentor or mentee id
 * @param ids mentor or mentee id
 * @returns boolean true
 */
const deleteAllRequest = async (menteeId, mentorId) => {
    if (menteeId && !mongoose_1.Types.ObjectId.isValid(menteeId)) {
        throw new http_errors_1.default.BadRequest('Invalid mentee id');
    }
    ;
    if (mentorId && !mongoose_1.Types.ObjectId.isValid(mentorId)) {
        throw new http_errors_1.default.BadRequest('Invalid mentor id');
    }
    ;
    await mentorshipRequest_1.default.findByIdAndDelete({
        $or: [{ menteeId: menteeId, mentorId: mentorId }]
    });
    return true;
};
exports.deleteAllRequest = deleteAllRequest;
