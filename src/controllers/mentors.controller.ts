import { Request, Response } from "express";
import * as services from "../services/mentors-services";


export const getAllMentorsAndMentees = async (req: Request, res: Response) => {
    const data = await services.getAllMentorsAndMentees({ ...req.query as any });
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
