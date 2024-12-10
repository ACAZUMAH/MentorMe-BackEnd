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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyMentorsOrMentees = exports.getAllMentorsOrMentees = exports.deleteUser = exports.updateProfile = void 0;
const services = __importStar(require("../services/users-services/index"));
/**
 * update a user's profile data by id
 * @param req Request object
 * @param res Response object
 * @returns user's profile data after updating
 * and false if unable to update
 */
const updateProfile = async (req, res) => {
    const user = req.user;
    const userData = await services.findUserByIdAndUpdate(user.id, req.body);
    const data = await services.findUserById(user.id);
    if (userData) {
        return res.status(200).json({ success: true, data: data });
    }
    return res.status(400).json({ success: false, message: 'Unable to update profile' });
};
exports.updateProfile = updateProfile;
/**
 * delete a user by id
 * @param req Request object
 * @param res Response object
 * @returns deleted user's profile data
 */
const deleteUser = async (req, res) => {
    const user = req.user;
    const data = await services.findUserByIdAndDelete(user.id);
    if (data) {
        return res.status(200).json({ success: true, data: data });
    }
    return res.status(400).json({ success: false, message: 'Unable to delete user' });
};
exports.deleteUser = deleteUser;
/**
 * controller for getting a list of mentors or mentees
 * @param req Request object
 * @param res Response object
 * @returns found list of mentors or mentees
 */
const getAllMentorsOrMentees = async (req, res) => {
    const data = await services.findAllMentorsOrMentees({ ...req.query });
    if (data) {
        return res.status(200).json({
            success: true,
            data: data.length > 0 ? data : { message: `No ${req.query.role}s found` }
        });
    }
    ;
    return res.status(400).json({ success: false, message: `Could not get ${req.query.role}s` });
};
exports.getAllMentorsOrMentees = getAllMentorsOrMentees;
/**
 * controller for getting mentor mentees or mentee mentors
 * @param req Request Object
 * @param res Response Object
 * @returns list of mentees for a mentor or mentors for a mentee
 */
const getMyMentorsOrMentees = async (req, res) => {
    const user = req.user;
    const data = await services.getMyMentorsOrMentees(user.id, { ...req.query });
    if (data) {
        return res.status(200).json({
            success: true,
            data: data.length > 0 ? data : { message: `No mentees found` }
        });
    }
    ;
    return res.status(400).json({ success: false, message: `Could not get data` });
};
exports.getMyMentorsOrMentees = getMyMentorsOrMentees;
