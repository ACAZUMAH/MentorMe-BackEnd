import { Types } from "mongoose";

export interface mentorDocument {
    _id: Types.ObjectId
    mentorId: string | Types.ObjectId
    mentees: Array<string | Types.ObjectId>
}