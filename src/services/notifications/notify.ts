import { Types } from "mongoose";
import { io } from "../../servers/server";

export const sendNotification = (recieverId: string | Types.ObjectId, notification: any) => {
    io.to(recieverId).emit('notification', notification);
}