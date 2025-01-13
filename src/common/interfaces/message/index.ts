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
  messagesIds: string;
  senderId: string;
  message: String;
  delivered?: boolean;
}