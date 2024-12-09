import User from "../../models/schemas/usersSchema";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import { userType } from "../types";
import { validateAuthData, validateProfileData } from "./validateUserData";
import { createAuth } from "../auth-services";
import { hashPassword } from "../../helpers";
import filterQuery from "../filters/filter";
import { queryType } from "../types";
import * as Mentor from '../mentors-services/index'
import * as Mentee from '../mentees-services/index'


/**
 * create a new user in the database with phone and 
 * password, then create an auth record
 * @param data required user data
 * @returns saved user
 */
export const createUser = async (data: userType) => {
    await validateAuthData(data);
    const hashedPassword = await hashPassword(data.password as string);
    const user = await User.create({ ...data, password: hashedPassword });
    if (!user) {
        throw new createHttpError.InternalServerError('Could not create user');
    }
    await createAuth(user._id);
    return user;
};

/**
 * create a new user in the database with google data for those signing in with google
 * @param data required user data
 * @returns created user
 * @throws 500 if user could not be created
 */
export const createGoogleUser = async (data: userType) => {
    const user = await User.create({ ...data });
    if (!user) {
        throw new createHttpError.InternalServerError('Could not create user');
    }
    return user;
};

/**
 * checks if a user already exists with the phone number
 * @param phone user's phone number
 * @throws 409 if user already exists
 */
export const checkUserExists = async (phone: string) => {
    if (await User.exists({ phone })) {
        throw new createHttpError.Conflict('User already exists');
    };
};

/**
 * find a user from the database by id
 * @param id user's id
 * @returns found user
 * @throws 404 if no user found with the id
 * @throws 400 if the id is invalid
 */
export const findUserById = async (id: string | Types.ObjectId) => {
    if (!Types.ObjectId.isValid(id)) {
        throw new createHttpError.BadRequest('Invalid user id');
    }
    const user = await User.findById({ _id: id }, { password: 0, __v: 0 });
    return user;
};

/**
 * find a user from the database by email
 * @param email user's email
 * @returns found user
 * @throws 404 if no user found with the email
 */
export const findUserByEmail = async (email: string) => {
    /*if(!await User.exists({ email })){
        throw new createHttpError.NotFound('No user found with this email');
    };*/
    return await User.findOne({ email });
};

/**
 * get a user by phone number
 * @param phone user phone number
 * @returns user
 */
export const getUserByPhone = async (phone: string) => {
    if (!await User.exists({ phone })) {
        throw new createHttpError.NotFound('No user found with this phone number');
    };
    return await User.findOne({ phone });
};

/**
 * find the user by id and update the user's isAuthenticated
 * field to true after verification
 * @param id user's id
 * @returns boolean true
 * @throws 404 if no user found with the id
 * @throws 400 if the id is invalid
 */
export const finduserByIdAndUpdateIsAuth = async (id: string | Types.ObjectId) => {
    if (!Types.ObjectId.isValid(id)) {
        throw new createHttpError.BadRequest('Invalid user id');
    }
    const user = await User.findByIdAndUpdate({ _id: id }, { isAuthenticated: true }, { new: true });
    if (!user) {
        throw new createHttpError.NotFound('No user found with this id');
    }
    return true;
};

/**
 * find a user by id and update the user's profile data
 * @param id id of the user
 * @param data data to be updated
 * @returns updated user
 * @throws 404 if no user found with the id
 * @throws 400 if the id is invalid
 */
export const findUserByIdAndUpdate = async (id: string | Types.ObjectId, data: userType) => {
    if (!Types.ObjectId.isValid(id)) {
        throw new createHttpError.BadRequest('Invalid user id');
    };
    await validateProfileData(data);
    const user = await User.findByIdAndUpdate({ _id: id }, { ...data }, { new: true });
    if (!user) {
        throw new createHttpError.NotFound('No user found with this id');
    };
    return true;
};

/**
 * find a user by id and delete the user
 * @param id id of the user
 * @returns deleted user
 * @throws 404 if no user found with the id
 * @throws 400 if the id is invalid
 */
export const findUserByIdAndDelete = async (id: string | Types.ObjectId) => {
    if (!Types.ObjectId.isValid(id)) {
        throw new createHttpError.BadRequest('Invalid user id');
    };
    const user = await User.findByIdAndDelete({ _id: id });
    if (!user) {
        throw new createHttpError.NotFound('No user found with this id');
    };
    if(user.role === 'Mentor'){
        await Mentor.deleteMentorData(id);
    };
    if(user.role === 'Mentee'){
        await Mentee.deleteMenteeData(id);
    };
    return user;
};

/**
 * find a user from the databaase by role and filter
 *  by fullName, programmeOfStudy, level and sort them
 * @param query query object
 * @returns result of the query
 */
export const findAllMentorsOrMentees = async (query: queryType) => {
    const { page, limit } = query;
    const queryObject = await filterQuery(query);
    let result = User.find(queryObject, { password: 0, __v: 0 });
    if (query.sort) {
        const sortArray = query.sort.split(',').join(' ');
        result = result.sort(sortArray);
    } else {
        result = result.sort('fullName');
    }
    const pages = Number(page) || 1;
    const limits = Number(limit) || 10;
    const skip = (pages - 1) * limits;
    result = result.skip(skip).limit(limits);
    return await result;
};

/**
 * 
 * @param id 
 * @param query 
 * @returns 
 */
export const getMyMentorsOrMentees = async (id: string | Types.ObjectId, query: queryType) => {
    if (!Types.ObjectId.isValid(id)) {
        throw new createHttpError.BadRequest('Invalid user id');
    }
    const { page, limit } = query;
    const queryObject = await filterQuery(query);
    const user = await findUserById(id);
    const role = user?.role;
    let data: any;
    let list: any;
    if (role === 'Mentor') {
        data = await Mentor.getMentorData(id);
        list = data?.mentees;
    }
    if (role === 'Mentee') {
        data = await Mentee.getMenteeData(id);
        list = data?.mentors;
    }
    let result = User.find({ _id: { $in: list }, ...queryObject }, { password: 0, __v: 0} )
    const pages = Number(page) || 1;
    const limits = Number(limit) || 10;
    const skip = (pages - 1) * limits;
    result = result.skip(skip).limit(limits);
    return await result;
};