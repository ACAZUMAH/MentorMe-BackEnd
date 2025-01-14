import { Request, Response } from "express";
import * as services from "../../services/user/index";
import { constructHTTPRespone } from "../../common/helpers";

/**
 * update a user's profile data by id
 * @param req Request object
 * @param res Response object
 * @returns user's profile data after updating 
 * and false if unable to update
 */
export const updateProfile = async (req: Request, res: Response) => {
    const user: any = req.User;
    const data = await services.getUserByIdAndUpdate({ id: user._id, ...req.body });
    if(data) return constructHTTPRespone(data)(res);
    return constructHTTPRespone({message: 'Unable to update profile'}, null, 500)(res);
};

/**
 * 
 * @param req Request object
 * @param res Response object
 * @returns 
 */
export const getProfile = async (req: Request, res: Response) => {
    const user: any = req.User;
    const profile = await services.getUserById(user._id);
    return constructHTTPRespone(profile)(res);
};

/**
 * delete a user by id
 * @param req Request object
 * @param res Response object
 * @returns deleted user's profile data
 */
export const deleteUser = async (req: Request, res: Response) => {
    const user: any = req.User;
    const data = await services.findUserByIdAndDelete(user._id);
    if(data) return constructHTTPRespone(data)(res);
    return constructHTTPRespone({ message: "Unable to delete user" }, null, 500)(res);
};
 
/**
 * controller for getting a list of mentors or mentees
 * @param req Request object
 * @param res Response object
 * @returns found list of mentors or mentees
 */
export const getAllMentorsOrMentees = async (req: Request, res: Response) => {
    const data = await services.getMentorsOrMentees({ ...req.query as any });
    if(data) return constructHTTPRespone(data)(res);
    return constructHTTPRespone({ message: `Could not get ${req.query.role}s` }, null, 404)(res);
};

/**
 * controller for getting mentor mentees or mentee mentors
 * @param req Request Object
 * @param res Response Object
 * @returns list of mentees for a mentor or mentors for a mentee
 */
export const getMyMentorsOrMentees = async (req: Request, res: Response) => {
    const user: any = req.User;
    if(user.role === 'Mentor'){
        const mentees = await services.getMyMentees({ id: user._id, ...req.query });
        return constructHTTPRespone(mentees)(res);
    };
    if(user.role === 'Mentee'){
        const mentors = await services.getMyMentors({ id: user._id, ...req.query });
        return constructHTTPRespone(mentors)(res);
    };
    return constructHTTPRespone({
      message:
        user.role === "Mentor"
          ? "Could not find mentees"
          : "Could not find mentors",
    }, null, 404)(res);
};

