import User from "../../models/schemas/usersSchema";
import filterResult from "../filters/filter";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import { queryType } from "../types";

/**
 * find a user from the databaase by role and filter
 *  by fullName, programmeOfStudy, level and sort them
 * @param query query object
 * @returns result of the query
 */
export const getAllMentorsAndMentees = async (query: queryType) => {
    const { page, limit } = query;
    let result = await filterResult(query, User);
    const pages = Number(page) || 1;
    const limits = Number(limit) || 10;
    const skip = (pages - 1) * limits;
    result = result.skip(skip).limit(limits);
    return await result;
};

export const getMentorMentee = async (id: string) => {
    
};