import { Types } from "mongoose";

export interface message {
  _id: Types.ObjectId
  senderId: string | Types.ObjectId
  message: string
  delivered: boolean
}

export interface messageDocument {
  messagesIds: string
  messages: Array<message>
}

export interface messageInput {
  _id: Types.ObjectId;
  messagesIds: string;
  senderId: string;
  message: String;
  delivered?: boolean;
}