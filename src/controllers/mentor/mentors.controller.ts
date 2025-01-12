import { Request, Response } from "express";
import createHttpError from "http-errors";
import { updateMentor } from "../../services/mentee";
import * as mentor from "../../services/mentor";
import * as services from "../../services/mentoship/mentorship";
import * as resources from "../../services/resources/index";
import { constructHTTPRespone } from "../../common/helpers";

/**
 * controller for geting mentorship requests by mentor id
 * @param req Request object
 * @param res Response object
 * @returns found mentorship requests
 */
export const getMentorshipRequests = async (req: Request, res: Response) => {
    const user: any = req.User;
    const data = await services.getRequests({ id: user._id, ...req.query });
    return constructHTTPRespone(data)(res);
};

/**
 * controller for accepting a mentorship request
 * @param req Request object
 * @param res Response object
 * @returns accepted request
 */
export const acceptRequest = async (req: Request, res: Response) => {
    const user: any = req.User;
    const data = await services.acceptRequest({ mentorId: user._id, menteeId: req.params.id });
    mentor.updateMentee({ mentorId: user._id, menteeId: req.params.id });
    updateMentor({ mentorId: user._id, menteeId: req.params.id });
    return constructHTTPRespone(data)(res);
};

/**
 * controller for rejecting a mentorship request
 * @param req Request object
 * @param res Response object
 * @returns rejected request
 */
export const rejectRequest = async (req: Request, res: Response) => {
    const user: any = req.User;
    const data = await services.rejectRequest({ mentorId: user._id, menteeId: req.params.id });
    return constructHTTPRespone(data)(res);
};


/**
 * controller for uploading resources 
 * @param req Request object
 * @param res Reponse object
 * @returns uploaded resources
 */
export const uploadResources = async (req: Request, res: Response) => {
    const user: any = req.User;
    const upload = await resources.createResource({ uploadedBy: user._id, ...req.body });
    return constructHTTPRespone(upload, null, 201)(res);
};

/**
 * controller for menotr to get uploaded resources
 * @param req Request object
 * @param res Response object
 * @returns uploaded resources
 */
export const getMentorUploadedResources = async (req: Request, res: Response) => {
    const user: any = req.User;
    const data = await resources.getResourcesBymentorId({ uploadedBy: user._id, ...req.query }); 
    return constructHTTPRespone(data)(res);
};

/**
 * 
 * @param req 
 * @param res 
 */
export const deleteResources = async (req: Request, res: Response) => {
    const user: any = req.User;
    const deleted = await resources.deleteUploadResource(req.params.id, user.id)
    constructHTTPRespone(deleted)(res);
};