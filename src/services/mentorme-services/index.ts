import User from "../../models/schemas/usersSchema";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import { userType } from "../types";

export const getAllMentorsAllMentees = async (role: string) => {
    const mentorsmentees = await User.find({ role: `${role}` });
    if (!mentorsmentees) {
        throw new createHttpError.NotFound('No result found');
    }
    return mentorsmentees;
}