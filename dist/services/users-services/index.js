"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyMentorMentee = exports.findAllMentorsOrMentees = exports.findUserByIdAndDelete = exports.findUserByIdAndUpdate = exports.finduserByIdAndUpdateIsAuth = exports.getUserByPhone = exports.findUserByEmail = exports.findUserById = exports.checkUserExists = exports.createGoogleUser = exports.createUser = void 0;
const usersSchema_1 = __importDefault(require("../../models/schemas/usersSchema"));
const mentors_1 = __importDefault(require("../../models/schemas/mentors"));
const mentees_1 = __importDefault(require("../../models/schemas/mentees"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = require("mongoose");
const validateUserData_1 = require("./validateUserData");
const auth_services_1 = require("../auth-services");
const helpers_1 = require("../../helpers");
const filter_1 = __importDefault(require("../filters/filter"));
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
        throw new http_errors_1.default.InternalServerError('Could not create user');
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
        throw new http_errors_1.default.InternalServerError('Could not create user');
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
        throw new http_errors_1.default.Conflict('User already exists');
    }
    ;
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
        throw new http_errors_1.default.BadRequest('Invalid user id');
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
    if (!await usersSchema_1.default.exists({ phone })) {
        throw new http_errors_1.default.NotFound('No user found with this phone number');
    }
    ;
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
        throw new http_errors_1.default.BadRequest('Invalid user id');
    }
    const user = await usersSchema_1.default.findByIdAndUpdate({ _id: id }, { isAuthenticated: true }, { new: true });
    if (!user) {
        throw new http_errors_1.default.NotFound('No user found with this id');
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
        throw new http_errors_1.default.BadRequest('Invalid user id');
    }
    ;
    await (0, validateUserData_1.validateProfileData)(data);
    const user = await usersSchema_1.default.findByIdAndUpdate({ _id: id }, { ...data }, { new: true });
    if (!user) {
        throw new http_errors_1.default.NotFound('No user found with this id');
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
        throw new http_errors_1.default.BadRequest('Invalid user id');
    }
    ;
    const user = await usersSchema_1.default.findByIdAndDelete({ _id: id });
    if (!user) {
        throw new http_errors_1.default.NotFound('No user found with this id');
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
    const queryObject = await (0, filter_1.default)(query);
    let result = usersSchema_1.default.find(queryObject);
    if (query.sort) {
        const sortArray = query.sort.split(',').join(' ');
        result = result.sort(sortArray);
    }
    else {
        result = result.sort('fullName');
    }
    const pages = Number(page) || 1;
    const limits = Number(limit) || 10;
    const skip = (pages - 1) * limits;
    result = result.skip(skip).limit(limits);
    return await result;
};
exports.findAllMentorsOrMentees = findAllMentorsOrMentees;
const getMyMentorMentee = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new http_errors_1.default.BadRequest('Invalid user id');
    }
    const user = await usersSchema_1.default.findById(id);
    const role = user?.role;
    let list;
    if (role == 'mentor') {
        list = await mentors_1.default.findOne({ mentorID: id });
    }
    if (role == 'mentee') {
        list = await mentees_1.default.findOne({ menteeID: id });
    }
    return list;
};
exports.getMyMentorMentee = getMyMentorMentee;
