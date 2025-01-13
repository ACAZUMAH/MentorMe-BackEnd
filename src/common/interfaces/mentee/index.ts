import { Types } from "mongoose";
import { bookmarkDocument } from "../bookmark";

export interface menteeDocument {
    _id: Types.ObjectId
    menteeId: string | Types.ObjectId
    mentors: Array<string | Types.ObjectId>
    bookmarks: bookmarkDocument
};
