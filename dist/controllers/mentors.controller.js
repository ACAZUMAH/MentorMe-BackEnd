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
exports.rejectRequest = exports.acceptRequest = exports.getMentorshipRequests = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const mentees_1 = require("../services/mentees-services/mentees");
const mentor = __importStar(require("../services/mentors-services"));
const services = __importStar(require("../services/mentoship-services/mentorship"));
/**
 * controller for geting mentorship requests by mentor id
 * @param req Request object
 * @param res Response object
 * @returns found mentorship requests
 */
const getMentorshipRequests = async (req, res) => {
    const user = req.user;
    const data = await services.findRequests(user.id, req.query.page);
    if (!data) {
        return new http_errors_1.default.BadRequest('No mentorship requests found');
    }
    return res.status(200).json({ success: true, data: data });
};
exports.getMentorshipRequests = getMentorshipRequests;
/**
 * controller for accepting a mentorship request
 * @param req Request object
 * @param res Response object
 * @returns accepted request
 */
const acceptRequest = async (req, res) => {
    const user = req.user;
    const data = await services.acceptRequest({ mentorId: user.id, menteeId: req.params.id });
    if (!data) {
        return new http_errors_1.default.BadRequest('Unable to accept request');
    }
    mentor.addMentee({ mentorId: user.id, menteeId: req.params.id });
    (0, mentees_1.addMentor)({ mentorId: user.id, menteeId: req.params.id });
    return res.status(200).json({ success: true, data: data });
};
exports.acceptRequest = acceptRequest;
/**
 * controller for rejecting a mentorship request
 * @param req Request object
 * @param res Response object
 * @returns rejected request
 */
const rejectRequest = async (req, res) => {
    const user = req.user;
    const data = await services.rejectRequest({ mentorId: user.id, menteeId: req.params.id });
    if (!data) {
        return new http_errors_1.default.BadRequest('Unable to reject request');
    }
    return res.status(200).json({ success: true, data: data });
};
exports.rejectRequest = rejectRequest;
