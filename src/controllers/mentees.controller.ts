import { Request, Response } from 'express';
import * as services from '../services/mentoship-services/mentorship';
import * as resource from '../services/resources/index'
import * as mentees from '../services/mentees-services'
import createHttpError from 'http-errors';

/**
 * controller for requesting mentorship from a mentor
 * @param req Request object
 * @param res Response object
 * @returns requested mentorship
 * @throws 400 if id is invalid
 */
export const menteeRequestMentorship = async (req: Request, res: Response) => {
    const user: any = req.user;
    const data = await services.requestMentorship({ menteeId: user.id, mentorId: req.params.id });
    if (!data) {
        throw new createHttpError.BadRequest('Unable to request mentorship');
    };
    return res.status(200).json({ success: true, data: data });
};

/**
 * controller for getting list of mentorship requests made by a mentee 
 * @param req Request object
 * @param res Response object
 * @returns list of mentorship requests
 */
export const getMenteeRequests = async (req: Request, res: Response) => {
    const user: any = req.user;
    const data = await services.findRequests(user.id, req.query.page as string);
    if (!data) {
        throw new createHttpError.BadRequest('No mentorship requests found');
    };
    return res.status(200).json({ success: true, data: data });
};

/**
 * controlller for canceling mentorship request
 * @param req Request object
 * @param res Response object
 * @throws 400 if no request is found
 * @return canceled request
 */
export const cancelMentorshipRequest = async (req: Request, res: Response) => {
    const user: any = req.user;
    const cancel: any = await services.CancelRequest(user.id, req.params.id);
    if(cancel){
        cancel.status = 'canceled';
    }
    return res.status(200).json({ success: true, data: cancel });
};


/**
 * controller for getting uploaded resources
 * @param req Request object
 * @param res Response object
 * @returns uploded resources
 * @throws 404 if no resources found
 */
export const getUploadedResources = async (req: Request, res: Response) => {
    const user: any = req.user;
    const resources: any = []
    const data = await resource.getGeneralResources({ ...req.query })
    const forwaded = await resource.getforwardedResources(user.id, { ...req.query }) 
    if(data.length === 0 && forwaded.length === 0){
        throw new createHttpError.NotFound("No uploaded resources found");
    };
    if(data.length !== 0){
        resources.push(data);
    };
    if(forwaded.length !== 0){
        resources.push(forwaded);
    };
    return res.status(200).json({ success: true, data: resources });
};

/**
 * 
 * @param req Request object
 * @param res Response object
 * @returns 
 */
export const bookmarkResources = async (req: Request, res: Response) => {
    const user: any = req.user;
    const bookmarked = await mentees.bookmarkResource(user.id, req.params.id)
    if(bookmarked){
        return res.status(200).json({ success: true, bookmark: 'bookmarked' });
    };
    return res.status(400).json({ success: false, message: 'Unable to bookmark resources'})
};

/**
 * 
 * @param req Request object
 * @param res Response object
 * @returns
 */
export const getBookmarkedResources = async (req: Request, res: Response) => {
    const user: any = req.user;
    const bookmarkList: any = await mentees.findBookmarkedResources(user.id);
    const bookmarkedResources = await resource.findResourcesByIds(bookmarkList.resourcesIds)
    if(!bookmarkedResources){
        throw new createHttpError.NotFound('No bookmarekd resources yet');
    };
    return res
      .status(200)
      .json({ success: true, bookmarked: bookmarkedResources }); 
};