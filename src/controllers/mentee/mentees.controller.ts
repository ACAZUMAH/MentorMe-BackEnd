import { Request, Response } from 'express';
import * as services from '../../services/mentoship/mentorship';
import * as resource from '../../services/resources/index'
import * as mentees from '../../services/mentee'
import createHttpError from 'http-errors';
import { constructHTTPRespone } from '../../common/helpers';

/**
 * controller for requesting mentorship from a mentor
 * @param req Request object
 * @param res Response object
 * @returns requested mentorship
 * @throws 400 if id is invalid
 */
export const menteeRequestMentorship = async (req: Request, res: Response) => {
    const user: any = req.User;
    const data = await services.requestMentorship({ menteeId: user._id, mentorId: req.params.id });
    return constructHTTPRespone(data, null, 201)(res);
};

/**
 * controller for getting list of mentorship requests made by a mentee 
 * @param req Request object
 * @param res Response object
 * @returns list of mentorship requests
 */
export const getMenteeRequests = async (req: Request, res: Response) => {
    const user: any = req.User;
    const data = await services.getRequests({ id: user._id, ...req.query });
    return constructHTTPRespone(data)(res);
}; 

/**
 * controlller for canceling mentorship request
 * @param req Request object
 * @param res Response object
 * @throws 400 if no request is found
 * @return canceled request
 */
export const cancelMentorshipRequest = async (req: Request, res: Response) => {
    const user: any = req.User;
    const canceled : any = await services.CancelRequest(user._id, req.params.id);
    if(canceled){
        canceled.cancel.status = 'canceled';
    };
    return constructHTTPRespone(canceled)(res);
};


/**
 * controller for getting uploaded resources by MentorMe
 * @param req Request object
 * @param res Response object
 * @returns uploded resources
 * @throws 404 if no resources found
 */
export const getMentorMeResources = async (req: Request, res: Response) => {
    const user: any = req.User;
    const data = await resource.getGeneralResources({ ...req.query });
    return constructHTTPRespone(data)(res);
};

/**
 * controller for getting resources shared by mentor
 * @param req Request object
 * @param res Response object
 * @returns mentor uploaded resources
 * @throws 404 if no resources found
 */
export const getUploadedResources = async (req: Request, res: Response) => {
  const user: any = req.User;
  const forwarded = await resource.getforwardedResources({ menteeId: user._id, ...req.query });
  return constructHTTPRespone(forwarded)(res);
};

/**
 * 
 * @param req Request object
 * @param res Response object
 * @returns 
 */
export const bookmarkResources = async (req: Request, res: Response) => {
    const user: any = req.User;
    const bookmarked = await mentees.bookmarkResource(user._id, req.params.id)
    if(bookmarked){
        return constructHTTPRespone({ bookmarked: true }, null, 201)(res);
    };
    return constructHTTPRespone({ message: 'Unable to bookmark resources' }, null, 400)(res);
};

/**
 * 
 * @param req Request object
 * @param res Response object
 * @returns
 */
export const getBookmarkedResources = async (req: Request, res: Response) => {
    const user: any = req.User;
    const bookmarkList: any = await mentees.findBookmarkedResources(user._id);
    const bookmarkedResources = await resource.findResourcesByIds(bookmarkList.resourcesIds);
    return constructHTTPRespone(bookmarkedResources)(res);
};

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const removeBookMarkedResource = async (req: Request, res: Response) => {
    const user: any = req.User;
    const unBookmark = await mentees.removeBookmarkedResources(user._id, req.params.id);
    if(unBookmark) return constructHTTPRespone({ message: "removed" })(res);
    return constructHTTPRespone({ message: "Could not get resources" }, null, 404)(res);
};