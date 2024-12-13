import mongoose from "mongoose";

export const bookmarksSchema = new mongoose.Schema({
    resourcesIds: [{ type: mongoose.Types.ObjectId }]
});
