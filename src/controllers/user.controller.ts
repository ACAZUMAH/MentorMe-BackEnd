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
    if(userData){
        return res.status(200).json({ success: true, data: userData });
    }
    return res.status(400).json({ success: false, message: 'Unable to update profile' });
};

export const getMyMentorMentee = async(req: Request, res: Response) => {
    const user: any = req.user;
    console.log(user)
    const data = await services.getMyMentorMentee(user.id);
    console.log("received list: ",data)
    if (data) {
       return res.status(200).json({ success: true, data: data});
    }
    return res.status(400).json({ success: false, message: `Could not get data` });
}

