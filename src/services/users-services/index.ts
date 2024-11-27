import User from "../../models/schemas/usersSchema";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import { userType } from "../types";
import { validateAuthData, validateProfileData } from "./validateUserData";
import { createAuth } from "../auth-services";
import { hashPassword} from "../../helpers";

/**
 * create a new user in the database with phone and 
 * password, then create an auth record
 * @param data required user data
 * @returns saved user
 */
export const createUser = async (data: userType) => {
    await validateAuthData(data);
    const hash = await hashPassword(data.password!);
    const user = await User.create({ ...data, password: hash});
    if(!user){
        throw new createHttpError.InternalServerError('Could not create user');
    }
    await createAuth(user._id );
    return user;
};

/**
 * checks if a user already exists with the phone number
 * @param phone user's phone number
 */
export const checkUserExists = async (phone: string) => {
    if(await User.exists({ phone })){
        throw new createHttpError.Conflict('User already exists');
    };
};

/**
 * get a user by phone number
 * @param phone user phone number
 * @returns user
 */
export const getUserByPhone = async (phone: string) => {
    if(!await User.exists({ phone })){
        throw new createHttpError.NotFound('No user found with this phone numbr');
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
    if(!Types.ObjectId.isValid(id)){
        throw new createHttpError.BadRequest('Invalid user id');
    }
    const user = await User.findByIdAndUpdate({ _id: id }, { isAuthenticated: true }, { new: true });
    if(!user){
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
    if(!Types.ObjectId.isValid(id)){
        throw new createHttpError.BadRequest('Invalid user id');
    }
    const user = await User.findByIdAndUpdate({ _id: id }, { ...data }, { new: true });
    if(!user){
        throw new createHttpError.NotFound('No user found with this id');
    }
    return user;
};

/**
 * find a user by id and update the user's profile data
 * @param id id of the user
 * @param data data to be updated
 * @returns updated user
 * @throws 404 if no user found with the id
 * @throws 400 if the id is invalid
 */
export const findUserByIdAndCreateProfile = async (id: string | Types.ObjectId, data: userType) => {
    if (!Types.ObjectId.isValid(id)) {
        throw new createHttpError.BadRequest('Invalid user id');
    }
    await validateProfileData(data);
    const user = await User.findByIdAndUpdate({ _id: id}, { ...data }, { new: true });
    if (!user) {
        throw new createHttpError.NotFound('No user found with this id');
    }
    return user;
}

