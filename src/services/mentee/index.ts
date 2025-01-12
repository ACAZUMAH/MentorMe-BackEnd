import { menteeModel } from "../../models";
import createError from "http-errors";
import { Types } from "mongoose";
import { roleIds } from "../../common/interfaces/";

/**
 * find mentee by id and return it's data with mentors
 * @param id mentee id
 * @returns mentee data with list mentor ids
 * @throws 400 if id is invalid
 */
export const getMenteeData = async (id: string | Types.ObjectId) => {
    if(!Types.ObjectId.isValid(id)){
        throw new createError.BadRequest('Invalid mentee id');
    };
    const menteeData: any = await menteeModel.findOne({ menteeId: id });
    if(!menteeData) return new createError.NotFound('No mentors found');
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
export const updateMentor = async (ids: roleIds) => {
    if(!Types.ObjectId.isValid(ids.mentorId) || 
       !Types.ObjectId.isValid(ids.menteeId)){
        throw new createError.BadRequest('Invalid mentor or mentee id');
    };
    const menteeData = await menteeModel.findOneAndUpdate(
        { menteeId: ids.menteeId },
        { menteeId: ids.menteeId, $addToSet: { mentors: ids.mentorId } },
        { new: true, upsert: true }
    );
    if(!menteeData) throw new createError.InternalServerError('Unbale to add mentor')
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
        throw new createError.BadRequest("Invalid user's id");
    };
    const data = await menteeModel.findByIdAndDelete(id);
    if(!data) return;
    return true;
};

/**
 * adding a resources to the bookmark
 * @param menteeId mentee's id
 * @param resourceId resource's id
 * @returns boolean true if bookmarked
 */
export const bookmarkResource = async (menteeId: string | Types.ObjectId, resourceId: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(menteeId) || !Types.ObjectId.isValid(resourceId)) {
    throw new createError.BadRequest("Invalid resource id or mentee id");
  }
  const bookmark = await menteeModel.findOneAndUpdate(
    { menteeId: menteeId },
    { menteeId, $push: { 'bookmarks.resourcesIds': resourceId } },
    { upsert: true, new: true }
  );
  if (!bookmark) throw new createError.BadRequest('Unable to bookmark resource');

  return true;
};

/**
 * 
 * @param id 
 * @returns 
 */
export const findBookmarkedResources = async (id: string | Types.ObjectId) => {
    if(!Types.ObjectId.isValid(id)) {
        throw new createError.BadRequest('Invalid mentee id');
    };
    const bookmarked: any = await menteeModel.findOne({ menteeId: id });
    if(!bookmarked.bookmarks){
        throw new createError.NotFound('No bookmarked resources found');
    };
    return bookmarked.bookmarks;
};

/**
 * 
 * @param menteeId 
 * @param resourceId 
 * @returns 
 */
export const removeBookmarkedResources = async (menteeId: string | Types.ObjectId,resourceId: string | Types.ObjectId) => {
    if (!Types.ObjectId.isValid(menteeId) || !Types.ObjectId.isValid(resourceId)) {
        throw new createError.BadRequest("Invalid resource id or mentee id");
    };
    const unBookmark = await menteeModel.findOneAndUpdate(
        { menteeId: menteeId },
        { $pull: { 'bookmarks.resourcesIds': resourceId } }
    );
    if(!unBookmark){
        throw new createError.NotFound('No resources found with the provided id')
    };
    return true;
}