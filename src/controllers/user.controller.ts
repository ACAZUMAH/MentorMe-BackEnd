import { Request, Response } from "express";
import * as services from "../services/users-services/index";

/**
 * update a user's profile data by id
 * @param req Request object
 * @param res Response object
 * @returns user's profile data after updating 
 * and false if unable to update
 */
export const createProfile = async (req: Request, res: Response) => {
    const user: any = req.user;
    const userData = await services.findUserByIdAndUpdate(user._id, req.body);
    if(userData){
        res.status(200).json({ success: true, data: userData });
    }
    return res.status(400).json({ success: false, message: 'Unable to update profile' });
};

