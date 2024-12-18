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
exports.combineIds = exports.getMyMentees = exports.getMyMentors = exports.findAllMentorsOrMentees = exports.findUserByIdAndDelete = exports.findUserByIdAndUpdate = exports.finduserByIdAndUpdateIsAuth = exports.getUserByPhone = exports.findUserByEmail = exports.findUserById = exports.checkUserExists = exports.createGoogleUser = exports.createUser = void 0;
const usersSchema_1 = __importDefault(require("../../models/schemas/usersSchema"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = require("mongoose");
const validateUserData_1 = require("./validateUserData");
const auth_services_1 = require("../auth-services");
const helpers_1 = require("../../helpers");
const index_1 = require("../../helpers/index");
const mentorship = __importStar(require("../mentoship-services/mentorship"));
const Mentor = __importStar(require("../mentors-services/index"));
const Mentee = __importStar(require("../mentees-services/index"));
/**
 * create a new user in the database with phone and
 * password, then create an auth record
 * @param data required user data
 * @returns saved user
 */
const createUser = async (data) => {
    await (0, validateUserData_1.validateAuthData)(data);
    const hashedPassword = await (0, helpers_1.hashPassword)(data.password);
    const user = await usersSchema_1.default.create({ ...data, password: hashedPassword });
    if (!user) {
        throw new http_errors_1.default.InternalServerError("Could not create user");
    }
    await (0, auth_services_1.createAuth)(user._id);
    return user;
};
exports.createUser = createUser;
/**
 * create a new user in the database with google data for those signing in with google
 * @param data required user data
 * @returns created user
 * @throws 500 if user could not be created
 */
const createGoogleUser = async (data) => {
    const user = await usersSchema_1.default.create({ ...data });
    if (!user) {
        throw new http_errors_1.default.InternalServerError("Could not create user");
    }
    return user;
};
exports.createGoogleUser = createGoogleUser;
/**
 * checks if a user already exists with the phone number
 * @param phone user's phone number
 * @throws 409 if user already exists
 */
const checkUserExists = async (phone) => {
    if (await usersSchema_1.default.exists({ phone })) {
        throw new http_errors_1.default.Conflict("User already exists");
    }
};
exports.checkUserExists = checkUserExists;
/**
 * find a user from the database by id
 * @param id user's id
 * @returns found user
 * @throws 404 if no user found with the id
 * @throws 400 if the id is invalid
 */
const findUserById = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new http_errors_1.default.BadRequest("Invalid user id");
    }
    const user = await usersSchema_1.default.findById({ _id: id }, { password: 0, __v: 0 });
    return user;
};
exports.findUserById = findUserById;
/**
 * find a user from the database by email
 * @param email user's email
 * @returns found user
 * @throws 404 if no user found with the email
 */
const findUserByEmail = async (email) => {
    /*if(!await User.exists({ email })){
          throw new createHttpError.NotFound('No user found with this email');
      };*/
    return await usersSchema_1.default.findOne({ email });
};
exports.findUserByEmail = findUserByEmail;
/**
 * get a user by phone number
 * @param phone user phone number
 * @returns user
 */
const getUserByPhone = async (phone) => {
    if (!(await usersSchema_1.default.exists({ phone }))) {
        throw new http_errors_1.default.NotFound("No user found with this phone number");
    }
    return await usersSchema_1.default.findOne({ phone });
};
exports.getUserByPhone = getUserByPhone;
/**
 * find the user by id and update the user's isAuthenticated
 * field to true after verification
 * @param id user's id
 * @returns boolean true
 * @throws 404 if no user found with the id
 * @throws 400 if the id is invalid
 */
const finduserByIdAndUpdateIsAuth = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new http_errors_1.default.BadRequest("Invalid user id");
    }
    const user = await usersSchema_1.default.findByIdAndUpdate({ _id: id }, { isAuthenticated: true }, { new: true });
    if (!user) {
        throw new http_errors_1.default.NotFound("No user found with this id");
    }
    return true;
};
exports.finduserByIdAndUpdateIsAuth = finduserByIdAndUpdateIsAuth;
/**
 * find a user by id and update the user's profile data
 * @param id id of the user
 * @param data data to be updated
 * @returns updated user
 * @throws 404 if no user found with the id
 * @throws 400 if the id is invalid
 */
const findUserByIdAndUpdate = async (id, data) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new http_errors_1.default.BadRequest("Invalid user id");
    }
    await (0, validateUserData_1.validateProfileData)(data);
    const user = await usersSchema_1.default.findByIdAndUpdate({ _id: id }, { ...data }, { new: true });
    if (!user) {
        throw new http_errors_1.default.NotFound("No user found with this id");
    }
    ;
    return true;
};
exports.findUserByIdAndUpdate = findUserByIdAndUpdate;
/**
 * find a user by id and delete the user
 * @param id id of the user
 * @returns deleted user
 * @throws 404 if no user found with the id
 * @throws 400 if the id is invalid
 */
const findUserByIdAndDelete = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new http_errors_1.default.BadRequest("Invalid user id");
    }
    const user = await usersSchema_1.default.findByIdAndDelete({ _id: id });
    if (!user) {
        throw new http_errors_1.default.NotFound("No user found with this id");
    }
    ;
    if (user.role === "Mentor") {
        await Mentor.deleteMentorData(id);
        await mentorship.deleteAllRequest(id);
    }
    ;
    if (user.role === "Mentee") {
        await Mentee.deleteMenteeData(id);
        await mentorship.deleteAllRequest(id);
    }
    ;
    return user;
};
exports.findUserByIdAndDelete = findUserByIdAndDelete;
/**
 * find a user from the databaase by role and filter
 *  by fullName, programmeOfStudy, level and sort them
 * @param query query object
 * @returns result of the query
 */
const findAllMentorsOrMentees = async (query) => {
    const { page, limit } = query;
    const queryObject = await (0, index_1.filterQuery)(query);
    let result = usersSchema_1.default.find(queryObject, { password: 0, __v: 0 });
    if (query.sort) {
        const sortArray = query.sort.split(",").join(" ");
        result = result.sort(sortArray);
    }
    else {
        result = result.sort("fullName");
    }
    const pages = Number(page) || 1;
    const limits = Number(limit) || 10;
    const skip = (pages - 1) * limits;
    result = result.skip(skip).limit(limits);
    return await result;
};
exports.findAllMentorsOrMentees = findAllMentorsOrMentees;
/**
 *
 * @param id
 * @param query
 * @returns
 */
const getMyMentors = async (id, query) => {
    const { page, limit } = query;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new http_errors_1.default.BadRequest("Invalid user id");
    }
    ;
    const queryObject = await (0, index_1.filterQuery)(query);
    const data = await Mentee.getMenteeData(id);
    if (!data?.mentors) {
        throw new http_errors_1.default.NotFound("You don't have mentors yet");
    }
    ;
    let result = usersSchema_1.default.find({ _id: { $in: data.mentors }, ...queryObject }, { password: 0, __v: 0 });
    const pages = Number(page) || 1;
    const limits = Number(limit) || 10;
    const skip = (pages - 1) * limits;
    result = result.skip(skip).limit(limits);
    return await result;
};
exports.getMyMentors = getMyMentors;
/**
 *
 * @param id
 * @param query
 * @returns
 */
const getMyMentees = async (id, query) => {
    const { page, limit } = query;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new http_errors_1.default.BadRequest("Invalid user id");
    }
    ;
    const queryObject = await (0, index_1.filterQuery)(query);
    const data = await Mentor.getMentorData(id);
    if (!data?.mentees) {
        throw new http_errors_1.default.NotFound("You don't have mentees yet");
    }
    ;
    let result = usersSchema_1.default.find({ _id: { $in: data.mentees }, ...queryObject }, { password: 0, __v: 0 });
    const pages = Number(page) || 1;
    const limits = Number(limit) || 10;
    const skip = (pages - 1) * limits;
    result = result.skip(skip).limit(limits);
    return await result;
};
exports.getMyMentees = getMyMentees;
/**
 * combine the mentor and the mentee ids together
 * @param sender sender id
 * @param receiver receiver id
 * @returns return combined ids
 */
const combineIds = async (sender, receiver) => {
    const user = await (0, exports.findUserById)(sender);
    let combined;
    if (user?.role === 'Mentor') {
        combined = `${sender}${receiver}`;
    }
    else {
        combined = `${receiver}${sender}`;
    }
    return combined;
};
exports.combineIds = combineIds;
