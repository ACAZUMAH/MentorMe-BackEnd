import mongoose from "mongoose";
import { bookmarkDocument } from "../../common/interfaces";

export const bookmarksSchema = new mongoose.Schema<bookmarkDocument>({
    resourcesIds: [{ type: mongoose.Types.ObjectId }]
});
