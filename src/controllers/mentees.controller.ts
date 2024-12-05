import { Request, Response } from 'express'
import * as services from '../services/mentoship-services/mentorship'
import * as mentees from '../services/mentees-services/mentees'
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
    const data = await services.requestMentorship({ menteeId: user.id, mentorId: req.params.id});
    if (!data) {
        return new createHttpError.BadRequest('Unable to request mentorship');
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
        return new createHttpError.BadRequest('No mentorship requests found');
    };
    return res.status(200).json({ success: true, data: data });
};
