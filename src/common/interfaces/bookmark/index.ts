import { Types } from "mongoose";

export interface bookmarkDocument {
    _id: Types.ObjectId
    resourcesIds: string[] | Types.ObjectId[]
}