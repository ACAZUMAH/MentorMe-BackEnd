import { Request, Response } from "express";
import createHttpError from "http-errors";
import { addMentor } from "../services/mentees-services";
import * as mentor from "../services/mentors-services";
import * as services from "../services/mentoship-services/mentorship";
import * as resources from "../services/resources/index";


/**
 * controller for geting mentorship requests by mentor id
 * @param req Request object
 * @param res Response object
 * @returns found mentorship requests
 */
export const getMentorshipRequests = async (req: Request, res: Response) => {
    const user: any = req.user;
    const data = await services.findRequests(user.id, req.query.page as string);
    if (!data) {
        throw new createHttpError.BadRequest('No mentorship requests found');
    };
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
    if (!data) {
        throw new createHttpError.BadRequest('Unable to accept request');
    };
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
    if (!data) {
        throw new createHttpError.BadRequest('Unable to reject request');
    };
    return res.status(200).json({ success: true, data: data });
};


/**
 * controller for uploading resources 
 * @param req Request object
 * @param res Reponse object
 * @returns uploaded resources
 */
export const uploadResources = async (req: Request, res: Response) => {
    const user: any = req.user;
    const upload = await resources.createResource({ mentorId: user.id, ...req.body });
    return res.status(201).json({ success: true, data: upload });
};

/**
 * controller for menotr to get uploaded resources
 * @param req Request object
 * @param res Response object
 * @returns uploaded resources
 */
export const getMentorUploadedResources = async (req: Request, res: Response) => {
    const user: any = req.user;
    const data = await resources.getUploadedResourcesBymentorId(user.id, { ...req.query });
    if(!data){
        throw new createHttpError.NotFound('You have no uploaded resources yet');
    };
    return res.status(200).json({ success: true, data: data });
};

/**
 * 
 * @param req 
 * @param res 
 */
export const deleteResources = async (req: Request, res: Response) => {
    const user: any = req.user;
    const deleted = await resources.deleteUploadResource(req.params.id, user.id)
    if(!deleted){
        throw new createHttpError.NotFound('Resources not found')
    }
    res.status(200).json({ success: true, data: deleted });
};