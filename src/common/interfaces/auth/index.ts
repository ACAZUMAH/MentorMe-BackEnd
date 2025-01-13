import { Types } from "mongoose";

export interface authDocument {
    _id: Types.ObjectId
    userId: string | Types.ObjectId
    token: string
    expiresIn: Date
}