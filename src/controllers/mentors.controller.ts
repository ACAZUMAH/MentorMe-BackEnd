import { Request, Response } from "express";
import createHttpError from "http-errors"; 
import { addMentor } from "../services/mentees-services/mentees";
import * as mentor from "../services/mentors-services";
import * as services from "../services/mentoship-services/mentorship";

/**
 * controller for geting mentorship requests by mentor id
 * @param req Request object
 * @param res Response object
 * @returns found mentorship requests
 */
export const getMentorshipRequests = async (req: Request, res: Response) => {
    const user: any = req.user;
    const data = await services.findRequests(user.id, req.query.page as string);
    if(!data) {
        return new createHttpError.BadRequest('No mentorship requests found');
    }
    return res.status(200).json({ success: true, data: data });
};

/**
 * controller for accepting a mentorship request
 * @param req Request object
 * @param res Response object
 * @returns accepted request
 */
export const acceptRequest = async (req: Request, res: Response) => {
    const user: any = req.user;
    const data = await services.acceptRequest(
        { mentorId: user.id, menteeId: req.params.id }
    );
    if(!data) {
        return new createHttpError.BadRequest('Unable to accept request');
    }
    mentor.addMentee({ mentorId: user.id, menteeId: req.params.id });
    addMentor({ mentorId: user.id, menteeId: req.params.id });
    return res.status(200).json({ success: true, data: data });
};

/**
 * controller for rejecting a mentorship request
 * @param req Request object
 * @param res Response object
 * @returns rejected request
 */
export const rejectRequest = async (req: Request, res: Response) => {
    const user: any = req.user;
    const data = await services.rejectRequest(
        { mentorId: user.id, menteeId: req.params.id }
    );
    if(!data) {
        return new createHttpError.BadRequest('Unable to reject request');
    }
    return res.status(200).json({ success: true, data: data });
};