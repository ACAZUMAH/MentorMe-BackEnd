import User from "../../models/schemas/usersSchema";
import mentor from "../../models/schemas/mentors";
import filterResult from "../filters/filter";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import { queryType, idType } from "../types";

/**
 * find mentor by id and return it's data with mentees
 * @param id mentor id
 * @returns mentor data with list of mentee ids
 */
export const getMentorData = async (id: string | Types.ObjectId) => {
    if(!Types.ObjectId.isValid(id)){
        return  new createHttpError.BadRequest('Invalid mentor id');
    };
    const mentorData: any = await mentor.findOne({ mentorId: id });
    if(!mentorData){
        return new createHttpError.NotFound('No mentees found');
    };
    return mentorData;
};

/**
 * add mentee id to mentor's mentees list in the database
 * @param ids mentor and mentee ids
 * @returns boolean true
 * @throws 400 if id is invalid
 * @throws 404 if no mentor found
 */
export const addMentee = async (ids: idType) => {
    if(!Types.ObjectId.isValid(ids.mentorId) || 
       !Types.ObjectId.isValid(ids.menteeId)){
        return new createHttpError.BadRequest('Invalid mentor or mentee id');
    };
    const mentorData = await mentor.findOneAndUpdate(
        { mentorId: ids.mentorId },
        { $push: { mentees: ids.menteeId } },
        { new: true }
    );
    if(!mentorData){
        await mentor.create(
            { mentorId: ids.mentorId, mentees: [ids.menteeId] }
        );
    };
    return true;
};