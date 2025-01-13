import { mentorshipModel } from "../../models";
import createError from "http-errors";
import { Types, QueryOptions, FilterQuery } from "mongoose";
import { mentorshipDocument, mentorshipfilter, roleIds } from "../../common/interfaces";
import { getRequestedInfo } from "../user";
import * as helpers from '../../common/helpers'

/**
 * create a mentorship request to a mentor by mentee
 * @param ids mentor and mentee ids
 * @returns requested mentorship
 * @throws 400 if id is invalid
 */
export const requestMentorship = async (ids: roleIds) => {
  if (!Types.ObjectId.isValid(ids.mentorId) || !Types.ObjectId.isValid(ids.menteeId)) {
    throw new createError.BadRequest("Invalid mentor or mentee id");
  };

  const request = await mentorshipModel.create({ ...ids });
  const relatedInfo = await getRequestedInfo(ids.mentorId);

  return { request, related: relatedInfo };
};

/**
 * find a list of mentorship requests made by a mentee by either mentor or mentee id
 * @param id mentee id or mentor id
 * @returns list of mentorship requests
 */
export const getRequests = async (filter: mentorshipfilter) => {
  if (!Types.ObjectId.isValid(filter.id)) throw new createError.BadRequest("Invalid mentee id");

  const query: FilterQuery<mentorshipDocument> = {
    $or: [{ menteeId: filter.id }, { mentorId: filter.id }]
  };

  const page = helpers.getSanitizePage(filter.page);
  const limit = helpers.getSanitizeLimit(filter.limit);
  const skip = helpers.getSanitizeOffset(limit, page);

  const options: QueryOptions = {skip, lean: true, limit: limit + 1, sort: { createdAt: -1 },};

  const requests: any = await mentorshipModel.find(query, null, options);

  if(!Array.isArray(requests) || !requests.length) return await helpers.getPageFormat([], page, limit);
  
  const data = await Promise.all(
    requests.map( async (request: any) => {
      const isMentee = filter.id === request.menteeId.toString();

      const relatedInfo = isMentee === request.menteeId 
        ? await getRequestedInfo(request.mentorId)
        : await getRequestedInfo(request.menteeId);

      return { ...request, related: relatedInfo };
    })
  );

  return await helpers.getPageFormat(data, page, limit);
};

/**
 * find a request by mentor and mentee id and accept the request
 * @param ids mentor and mentee ids
 * @returns accepted request
 */
export const acceptRequest = async (ids: roleIds) => {
  if (!Types.ObjectId.isValid(ids.mentorId) || !Types.ObjectId.isValid(ids.menteeId)) {
    throw new createError.BadRequest("Invalid mentor or mentee id");
  }

  const request: any = await mentorshipModel.findOneAndUpdate(
    { mentorId: ids.mentorId, menteeId: ids.menteeId },
    { status: "accepted" },
    { new: true }
  );

  if (!request) throw new createError.NotFound("No request found");

  const ralated = await getRequestedInfo(request.menteeId)
  return request;
};

/**
 * find a request by mentor and mentee id and reject the request
 * @param ids mentor and mentee ids
 * @returns rejected request
 */
export const rejectRequest = async (ids: roleIds) => {
  if (!Types.ObjectId.isValid(ids.mentorId) || !Types.ObjectId.isValid(ids.menteeId)) {
    throw new createError.BadRequest("Invalid mentor or mentee id");
  }

  const request: any = await mentorshipModel.findOneAndUpdate(
    { mentorId: ids.mentorId, menteeId: ids.menteeId },
    { status: "rejected" },
    { new: true }
  );

  if (!request) throw new createError.NotFound("No request found");

  const related = await getRequestedInfo(request.mentorId);
  
  return { request, related };
};

/**
 * delete mentorship request from the database when a request is canceled
 * @param menteeId mentee's id
 * @param requestId id of the request to be canceled
 * @returns canceled request
 */
export const CancelRequest = async (menteeId: string, requestId: string) => {
  if (!Types.ObjectId.isValid(menteeId) || !Types.ObjectId.isValid(requestId)) {
    throw new createError.BadRequest("Invalid user or request id");
  };

  const cancel = await mentorshipModel.findOneAndDelete({ _id: requestId, menteeId });

  if (!cancel)  throw new createError.BadRequest("No request found");
  
  return cancel;
};

/**
 * delete all requests by provided mentor or mentee id
 * @param ids mentor or mentee id
 * @returns boolean true
 */
export const deleteAllRequest = async (menteeId?: string | Types.ObjectId,mentorId?: string | Types.ObjectId ) => {
    if(menteeId && !Types.ObjectId.isValid(menteeId)){
        throw new createError.BadRequest('Invalid mentee id')
    };
    if(mentorId && !Types.ObjectId.isValid(mentorId)){
        throw new createError.BadRequest('Invalid mentor id')
    };
    await mentorshipModel.findByIdAndDelete({ $or: [{ menteeId: menteeId, mentorId: mentorId }] });

    return true;
};
