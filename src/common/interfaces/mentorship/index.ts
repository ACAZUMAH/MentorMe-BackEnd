import { Types } from "mongoose";

export interface mentorshipDocument {
    _id: Types.ObjectId;
    mentorId?: string | Types.ObjectId | null;
    menteeId?: string | Types.ObjectId | null;
    status: string
}

export interface mentorshipfilter {
    id: string | Types.ObjectId;
    page?: number | string | null;
    limit?: number | string | null;
    sort?: number | string | null;
}