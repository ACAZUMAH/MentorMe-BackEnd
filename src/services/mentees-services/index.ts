import mentee from "../../models/schemas/mentees";
import User from "../../models/schemas/usersSchema";
import createHttpError from "http-errors";
import { idType } from "../types";
import { Types } from "mongoose";

/**
 * find mentee by id and return it's data with mentors
 * @param id mentee id
 * @returns mentee data with list mentor ids
 * @throws 400 if id is invalid
 */
export const getMenteeData = async (id: string | Types.ObjectId) => {
    if(!Types.ObjectId.isValid(id)){
        throw new createHttpError.BadRequest('Invalid mentee id');
    };
    const menteeData: any = await mentee.findOne({ menteeId: id });
    if(!menteeData){
        return new createHttpError.NotFound('No mentors found');
    };
    return menteeData;
};

/**
 * add mentor id to mentee's mentors list in the database 
 * after a mentorship request is accepted
 * @param ids mentor and mentee ids
 * @returns boolean true
 * @throws 400 if id is invalid
 * @throws 404 if no mentee found
 */
export const addMentor = async (ids: idType) => {
    if(!Types.ObjectId.isValid(ids.mentorId) || 
       !Types.ObjectId.isValid(ids.menteeId)){
        throw new createHttpError.BadRequest('Invalid mentor or mentee id');
    };
    const menteeData = await mentee.findOneAndUpdate(
        { menteeId: ids.menteeId },
        { $push: { mentors: ids.mentorId } },
        { new: true }
    );
    if(!menteeData){
        await mentee.create(
            { menteeId: ids.menteeId, mentors: [ids.mentorId] }
        );
    };
    return true;
};

/**
 * 
 * @param id 
 * @returns boolean true
 * @throws 400 if id is invalid
 */
export const deleteMenteeData = async (id: string | Types.ObjectId) => {
    if(!Types.ObjectId.isValid(id)){
        throw new createHttpError.BadRequest("Invalid user's id");
    };
    await mentee.findByIdAndDelete(id);
    return true;
};
