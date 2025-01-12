import { Types } from "mongoose";



export interface messageType {
    messagesIds: string,
    senderId: string
    message: String;
    delivered?: boolean;
}

export {

};