import { Request, Response } from "express";
import * as services from "../services/users-services/index";

/**
 * Create a user profile
 * @param req Request object
 * @param res Response object
 * @returns response message
 */
export const createprofile = async (req: Request, res: Response) => {
    const user: any = req.user;
    const profile = await services.findUserByIdAndUpdate(user.id, { ...req.body });
    if (!profile) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(201).json({ profile });
};