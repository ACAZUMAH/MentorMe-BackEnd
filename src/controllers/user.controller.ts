import { Request, Response } from "express";
import * as services from "../services/users-services/index";

/**
 * update a user's profile data by id
 * @param req Request object
 * @param res Response object
 * @returns user's profile data after updating 
 * and false if unable to update
 */
export const updateProfile = async (req: Request, res: Response) => {
    const user: any = req.user;
    const userData = await services.findUserByIdAndUpdate(user.id, req.body);
    const data = await services.findUserById(user.id);
    if(userData){
        return res.status(200).json({ success: true, data: data });
    }
    return res.status(400).json({ success: false, message: 'Unable to update profile' });
};

/**
 * delete a user by id
 * @param req Request object
 * @param res Response object
 * @returns deleted user's profile data
 */
export const deleteUser = async (req: Request, res: Response) => {
    const user: any = req.user;
    const data = await services.findUserByIdAndDelete(user.id);
    if(data){
        return res.status(200).json({ success: true, data: data });
    }
    return res.status(400).json({ success: false, message: 'Unable to delete user' });
};

/**
 * controller for getting a list of mentors or mentees
 * @param req Request object
 * @param res Response object
 * @returns found list of mentors or mentees
 */
export const getAllMentorsOrMentees = async (req: Request, res: Response) => {
    const data = await services.findAllMentorsOrMentees({ ...req.query as any });
    
    if(data) {
        return res.status(200).json(
            { 
                success: true, 
                data: data.length > 0 ? data : { message: `No ${req.query.role}s found` } 
            }
        );
    };
    return res.status(400).json({success: false, message: `Could not get ${req.query.role}s`}); 
};

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getMyMentorsOrMentees = async (req: Request, res: Response) => {
    const user: any = req.user;
    const data = await services.getMyMentorsOrMentees(user.id, { ...req.query as any });
    if (data) {
        return res.status(200).json(
            { 
                success: true, 
                data: data.length > 0 ? data : { message: `No mentees found` } 
            }
        );
    };
    return res.status(400).json({ success: false, message: `Could not get data` });
};

