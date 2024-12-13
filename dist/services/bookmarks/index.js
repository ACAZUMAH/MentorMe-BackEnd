"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBookmarkedResources = exports.bookmarkResource = void 0;
const bookmarks_1 = __importDefault(require("../../models/schemas/bookmarks"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = require("mongoose");
/**
 * adding a resources to the bookmark
 * @param menteeId mentee's id
 * @param resourceId resource's id
 * @returns bookmarked resource
 */
const bookmarkResource = async (menteeId, resourceId) => {
    if (!mongoose_1.Types.ObjectId.isValid(menteeId) ||
        !mongoose_1.Types.ObjectId.isValid(resourceId)) {
        throw new http_errors_1.default.BadRequest('Invalid id');
    }
    ;
    const bookmark = await bookmarks_1.default.findOneAndUpdate({ menteeId: menteeId }, { $push: { resourcesIds: resourceId } }, { new: true });
    if (!bookmark) {
        await bookmarks_1.default.create({
            menteeId: menteeId,
            resourcesIds: [resourceId]
        });
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
    const bookmarked = await bookmarks_1.default.findOne({ menteeId: id });
    if (!bookmarked) {
        throw new http_errors_1.default.NotFound('No bookmarked resources found');
    }
    ;
    return bookmarked;
};
exports.findBookmarkedResources = findBookmarkedResources;
