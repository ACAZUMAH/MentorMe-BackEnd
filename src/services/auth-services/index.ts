import Auth from "../../models/schemas/authSchema";
import createHttpError from "http-errors";
import {  Types } from "mongoose";
import { authType } from "../types";

/**
 * create an auth record with user id to save 
 * code and expiration time for verification
 * @param userId user id
 * @returns boolean true
 */
export const createAuth = async(userId: string | Types.ObjectId) => {
    if(!Types.ObjectId.isValid(userId)){
        throw new Error('Invalid user id');
    }
    await Auth.create({ userId });
    return true;
};

/**
 * 
 * @param code 
 * @returns 
 */
export const findAuthByCode = async (code: string) => {
    return await Auth.findOne({ code })
};

/**
 * 
 * @param id 
 * @param updateData 
 * @returns 
 */
export const findAuthAndUpdate = async (id: string | Types.ObjectId, updateData: authType) => {
    if(!Types.ObjectId.isValid(id)){
        throw new Error('Invalid user id');
    };
    return await Auth.findOneAndUpdate({ userId: id }, { ...updateData });
}

/**
 * 
 * @param code 
 */
export const findAuthByCodeAndDelete = async (code: string) => {
    if(!(await Auth.findOne({ code }))){
        throw new createHttpError.NotFound('Invalid otp');
    };
    return await Auth.findOneAndDelete({ code });
}; 