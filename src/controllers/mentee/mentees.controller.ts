import { Request, Response } from 'express';
import * as services from '../../services/mentoship/mentorship';
import * as resource from '../../services/resources/index'
import * as mentees from '../../services/mentee'
import createHttpError from 'http-errors';

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
    return res.status(200).json({ success: true, data: data });
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
    const user: any = req.User;
    const cancel: any = await services.CancelRequest(user._id, req.params.id);
    if(cancel){
        cancel.status = 'canceled';
    }
    return res.status(200).json({ success: true, data: cancel });
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
    const data = await resource.getGeneralResources({ ...req.query }) 
    return res.status(200).json({ success: true, data: data });
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
  const forwarded = await resource.getforwardedResources({ menteeId: user._id, ...req.query })
  return res.status(200).json({ success: true, data: forwarded})
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
    const user: any = req.User;
    const bookmarkList: any = await mentees.findBookmarkedResources(user._id);
    const bookmarkedResources = await resource.findResourcesByIds(bookmarkList.resourcesIds)
    if(!bookmarkedResources){
        throw new createHttpError.NotFound('No bookmarekd resources yet');
    };
    return res
      .status(200)
      .json({ success: true, bookmarked: bookmarkedResources }); 
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
    if(unBookmark){
        return res.status(200).json({ success: true, message: 'removed'});
    };
    return res.status(404).json({ success: false, message: 'Could not get resources'});
};