import { Request, Response } from "express";
import * as services from "../services/mentorme-services";


export const getAllMentorsAllMentees = async (req: Request, res: Response) => {
    const role = req.params.role;
    const data = await services.getAllMentorsAllMentees(role);
    if(data) {
        return res.status(200).json({ success: true, data: data.length > 0 ? data : { message: `No ${role}s found` } });
    }
    return res.status(400).json({success: false, message: `Could not get ${role}s`});
    // const mentors = await services.getMentors()
};
