import mentorship from '../../models/schemas/mentorshipRequest';
import createHttpError from 'http-errors';
import { idType } from '../types';
import { Types } from 'mongoose';

/**
 * create a mentorship request to a mentor by mentee 
 * @param ids mentor and mentee ids
 * @returns requested mentorship
 * @throws 400 if id is invalid
 */
export const requestMentorship = async (ids: idType) => {
    if(Types.ObjectId.isValid(ids.mentorId) 
        && Types.ObjectId.isValid(ids.menteeId)){
        const request = mentorship.create({
            ...ids
        });
        return request;
    };
    throw new createHttpError.BadRequest('Invalid mentor or mentee id');
};

/**
 * find a list of mentorship requests made by a mentee by either mentor or mentee id
 * @param id mentee id or mentor id
 * @returns list of mentorship requests
 */
export const findRequests = async (id: string | Types.ObjectId, page: string) => {
    if(!Types.ObjectId.isValid(id)){
        throw new createHttpError.BadRequest('Invalid mentee id');
    };
    let result = mentorship.find({ $or: [{ menteeId: id }, { mentorId: id }] });
    result = result.sort('createdAt');
    const pages = Number(page) || 1;
    const limit = 10;
    const skip = (pages - 1) * limit;
    result = result.skip(skip).limit(limit);
    return await result;
};

/**
 * find a request by mentor and mentee id and accept the request
 * @param ids mentor and mentee ids
 * @returns accepted request
 */
export const acceptRequest = async (ids: idType) => {
    if(!Types.ObjectId.isValid(ids.mentorId) || 
       !Types.ObjectId.isValid(ids.menteeId)){
        throw new createHttpError.BadRequest('Invalid mentor or mentee id');
    };
    const request = await mentorship.findOneAndUpdate(
        { mentorId: ids.mentorId, menteeId: ids.menteeId }, 
        { status: 'accepted' },
        { new: true }
    );
    if(!request){
        throw new createHttpError.NotFound('No request found');
    };
    return request;
};

/**
 * find a request by mentor and mentee id and reject the request
 * @param ids mentor and mentee ids
 * @returns rejected request
 */
export const rejectRequest = async (ids: idType) => {
    if(!Types.ObjectId.isValid(ids.mentorId) || 
       !Types.ObjectId.isValid(ids.menteeId)){
        throw new createHttpError.BadRequest('Invalid mentor or mentee id');
    };
    const request = await mentorship.findOneAndUpdate(
        { mentorId: ids.mentorId, menteeId: ids.menteeId }, 
        { status: 'rejected' },
        { new: true }
    );
    if(!request){
        throw new createHttpError.NotFound('No request found');
    };
    return request;
};

/**
 * 
 * @param id 
 */
export const CancelRequest = async (menteeId: string, requestId: string ) => {
  if (!Types.ObjectId.isValid(menteeId) || !Types.ObjectId.isValid(requestId)) {
    throw new createHttpError.BadRequest("Invalid user or request id");
  }
  const cancel = await mentorship.findByIdAndDelete({
    _id: requestId,
    menteeId,
  });
  if (!cancel) {
    throw new createHttpError.BadRequest("No request found");
  }
  return cancel;
};