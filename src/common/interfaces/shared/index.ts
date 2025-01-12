import { userDocument } from "../user";
import { Types } from "mongoose";

declare global {
    namespace Express {
        interface Request{
            User: userDocument
        }
    }
}

export interface roleIds {
    menteeId: string | Types.ObjectId
    mentorId: string | Types.ObjectId
};
