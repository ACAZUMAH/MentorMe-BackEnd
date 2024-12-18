"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBookmarkedResources = exports.findBookmarkedResources = exports.bookmarkResource = exports.deleteMenteeData = exports.addMentor = exports.getMenteeData = void 0;
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
        throw new http_errors_1.default.BadRequest('Invalid mentee id');
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
        throw new http_errors_1.default.BadRequest('Invalid mentor or mentee id');
    }
    ;
    const menteeData = await mentees_1.default.findOneAndUpdate({ menteeId: ids.menteeId }, { $addToSet: { mentors: ids.mentorId } }, { new: true, upsert: true });
    return true;
};
exports.addMentor = addMentor;
/**
 *
 * @param id
 * @returns boolean true
 * @throws 400 if id is invalid
 */
const deleteMenteeData = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new http_errors_1.default.BadRequest("Invalid user's id");
    }
    ;
    await mentees_1.default.findByIdAndDelete(id);
    return true;
};
exports.deleteMenteeData = deleteMenteeData;
/**
 * adding a resources to the bookmark
 * @param menteeId mentee's id
 * @param resourceId resource's id
 * @returns boolean true if bookmarked
 */
const bookmarkResource = async (menteeId, resourceId) => {
    if (!mongoose_1.Types.ObjectId.isValid(menteeId) ||
        !mongoose_1.Types.ObjectId.isValid(resourceId)) {
        throw new http_errors_1.default.BadRequest("Invalid resource id or mentee id");
    }
    const bookmark = await mentees_1.default.findOneAndUpdate({ menteeId: menteeId }, { $push: { 'bookmarks.resourcesIds': resourceId } }, { new: true });
    if (!bookmark) {
        throw new http_errors_1.default.BadRequest('Unable to bookmark resource');
    }
    return true;
};
exports.bookmarkResource = bookmarkResource;
/**
 *
 * @param id
 * @returns
 */
const findBookmarkedResources = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new http_errors_1.default.BadRequest('Invalid mentee id');
    }
    ;
    const bookmarked = await mentees_1.default.findOne({ menteeId: id });
    if (!bookmarked.bookmarks) {
        throw new http_errors_1.default.NotFound('No bookmarked resources found');
    }
    ;
    return bookmarked.bookmarks;
};
exports.findBookmarkedResources = findBookmarkedResources;
/**
 *
 * @param menteeId
 * @param resourceId
 * @returns
 */
const removeBookmarkedResources = async (menteeId, resourceId) => {
    if (!mongoose_1.Types.ObjectId.isValid(menteeId) ||
        !mongoose_1.Types.ObjectId.isValid(resourceId)) {
        throw new http_errors_1.default.BadRequest("Invalid resource id or mentee id");
    }
    ;
    const unBookmark = await mentees_1.default.findOneAndUpdate({ menteeId: menteeId }, { $pull: { 'bookmarks.resourcesIds': resourceId } });
    if (!unBookmark) {
        throw new http_errors_1.default.NotFound('No resources found with the provided id');
    }
    ;
    return true;
};
exports.removeBookmarkedResources = removeBookmarkedResources;
