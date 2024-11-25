"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByIdAndUpdate = exports.finduserByIdAndUpdateIsAuth = exports.getUserByPhone = exports.checkUserExists = exports.createUser = void 0;
const usersSchema_1 = __importDefault(require("../../models/schemas/usersSchema"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = require("mongoose");
const validateUserData_1 = require("./validateUserData");
const auth_services_1 = require("../auth-services");
const helpers_1 = require("../../helpers");
/**
 * create a new user in the database with phone and
 * password, then create an auth record
 * @param data required user data
 * @returns saved user
 */
const createUser = async (data) => {
    await (0, validateUserData_1.validateAuthData)(data);
    const hash = await (0, helpers_1.hashPassword)(data.password);
    const user = await usersSchema_1.default.create({ ...data, password: hash });
    if (!user) {
        throw new http_errors_1.default.InternalServerError('Could not create user');
    }
    await (0, auth_services_1.createAuth)(user._id);
    return user;
};
exports.createUser = createUser;
/**
 * checks if a user already exists with the phone number
 * @param phone user's phone number
 */
const checkUserExists = async (phone) => {
    if (await usersSchema_1.default.exists({ phone })) {
        throw new http_errors_1.default.Conflict('User already exists');
    }
    ;
};
exports.checkUserExists = checkUserExists;
/**
 * get a user by phone number
 * @param phone user phone number
 * @returns user
 */
const getUserByPhone = async (phone) => {
    if (!await usersSchema_1.default.exists({ phone })) {
        throw new http_errors_1.default.NotFound('No user found with this phone numbr');
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
    const user = await usersSchema_1.default.findByIdAndUpdate({ _id: id }, { ...data }, { new: true });
    if (!user) {
        throw new http_errors_1.default.NotFound('No user found with this id');
    }
    return user;
};
exports.findUserByIdAndUpdate = findUserByIdAndUpdate;
