"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookmarkedResources = exports.bookmarkResources = exports.getUploadedResources = exports.cancelMentorshipRequest = exports.getMenteeRequests = exports.menteeRequestMentorship = void 0;
const services = __importStar(require("../services/mentoship-services/mentorship"));
const resource = __importStar(require("../services/resources/index"));
const mentees = __importStar(require("../services/mentees-services"));
const http_errors_1 = __importDefault(require("http-errors"));
/**
 * controller for requesting mentorship from a mentor
 * @param req Request object
 * @param res Response object
 * @returns requested mentorship
 * @throws 400 if id is invalid
 */
const menteeRequestMentorship = async (req, res) => {
    const user = req.user;
    const data = await services.requestMentorship({ menteeId: user.id, mentorId: req.params.id });
    if (!data) {
        throw new http_errors_1.default.BadRequest('Unable to request mentorship');
    }
    ;
    return res.status(200).json({ success: true, data: data });
};
exports.menteeRequestMentorship = menteeRequestMentorship;
/**
 * controller for getting list of mentorship requests made by a mentee
 * @param req Request object
 * @param res Response object
 * @returns list of mentorship requests
 */
const getMenteeRequests = async (req, res) => {
    const user = req.user;
    const data = await services.findRequests(user.id, req.query.page);
    if (!data) {
        throw new http_errors_1.default.BadRequest('No mentorship requests found');
    }
    ;
    return res.status(200).json({ success: true, data: data });
};
exports.getMenteeRequests = getMenteeRequests;
/**
 * controlller for canceling mentorship request
 * @param req Request object
 * @param res Response object
 * @throws 400 if no request is found
 * @return canceled request
 */
const cancelMentorshipRequest = async (req, res) => {
    const user = req.user;
    const cancel = await services.CancelRequest(user.id, req.params.id);
    if (cancel) {
        cancel.status = 'canceled';
    }
    return res.status(200).json({ success: true, data: cancel });
};
exports.cancelMentorshipRequest = cancelMentorshipRequest;
/**
 * controller for getting uploaded resources
 * @param req Request object
 * @param res Response object
 * @returns uploded resources
 * @throws 404 if no resources found
 */
const getUploadedResources = async (req, res) => {
    const user = req.user;
    const resources = [];
    const data = await resource.getGeneralResources({ ...req.query });
    const forwaded = await resource.getforwardedResources(user.id, { ...req.query });
    if (data.length === 0 && forwaded.length === 0) {
        throw new http_errors_1.default.NotFound("No uploaded resources found");
    }
    ;
    if (data.length !== 0) {
        resources.push(data);
    }
    ;
    if (forwaded.length !== 0) {
        resources.push(forwaded);
    }
    ;
    return res.status(200).json({ success: true, data: resources });
};
exports.getUploadedResources = getUploadedResources;
/**
 *
 * @param req Request object
 * @param res Response object
 * @returns
 */
const bookmarkResources = async (req, res) => {
    const user = req.user;
    const bookmarked = await mentees.bookmarkResource(user.id, req.params.id);
    if (bookmarked) {
        return res.status(200).json({ success: true, bookmark: 'bookmarked' });
    }
    ;
    return res.status(400).json({ success: false, message: 'Unable to bookmark resources' });
};
exports.bookmarkResources = bookmarkResources;
/**
 *
 * @param req Request object
 * @param res Response object
 * @returns
 */
const getBookmarkedResources = async (req, res) => {
    const user = req.user;
    const bookmarkList = await mentees.findBookmarkedResources(user.id);
    const bookmarkedResources = await resource.findResourcesByIds(bookmarkList.resourcesIds);
    if (!bookmarkedResources) {
        throw new http_errors_1.default.NotFound('No bookmarekd resources yet');
    }
    ;
    return res
        .status(200)
        .json({ success: true, bookmarked: bookmarkedResources });
};
exports.getBookmarkedResources = getBookmarkedResources;
