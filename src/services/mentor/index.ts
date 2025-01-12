import { mentorModel } from "../../models/mentor/mentors";
import createError from "http-errors";
import { Types } from "mongoose";
import { roleIds } from "../../common/interfaces";

/**
 * find mentor by id and return it's data with mentees
 * @param id mentor id
 * @returns mentor data with list of mentee ids
 */
export const getMentorData = async (id: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(id)) throw new createError.BadRequest("Invalid mentor id");
  const mentorData: any = await mentorModel.findOne({ mentorId: id });
  if (!mentorData) throw new createError.NotFound("No mentees found");
  return mentorData;
};

/**
 * add mentee id to mentor's mentees list in the database
 * @param ids mentor and mentee ids
 * @returns boolean true
 * @throws 400 if id is invalid
 * @throws 404 if no mentor found
 */
export const updateMentee = async (ids: roleIds) => {
  if (!Types.ObjectId.isValid(ids.mentorId) || !Types.ObjectId.isValid(ids.menteeId)) {
    throw new createError.BadRequest("Invalid mentor or mentee id");
  }
  const mentorData = await mentorModel.findOneAndUpdate(
    { mentorId: ids.mentorId },
    { mentorId: ids.mentorId, $addToSet: { mentees: ids.menteeId } },
    { new: true, upsert: true }
  );
  if(!mentorData) throw new createError.InternalServerError('Unable to add mentee');
  return true;
};

/**
 *
 * @param id
 * @returns
 */
export const deleteMentorData = async (id: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new createError.BadRequest("Invalid user's id");
  }
  const mentor = await mentorModel.findByIdAndDelete(id);
  if(!mentor) return;
  return true;
};
