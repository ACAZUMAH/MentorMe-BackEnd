import { Request, Response } from 'express'
import * as services from '../services/mentoship-services/mentorship'
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
 * 
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
