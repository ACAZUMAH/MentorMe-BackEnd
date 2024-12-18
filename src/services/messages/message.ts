import { Types } from "mongoose";
import message from "../../models/schemas/messages";
import connectionIds from "../../models/schemas/connectionIds";
import { messageType } from "../types";
import validateMessageData from "./validate-message";
import createHttpError from "http-errors";

/**
 * add a new message to the sender and receiver database 
 * @param data 
 * @returns 
 */
export const newMesage = async (data: messageType) => {
    await validateMessageData(data);
    const messages = await message.findOneAndUpdate(
        { messagesIds: data.messagesIds },
        { $addToSet: { messages: { ...data } } },
        { new: true, upsert: true }
    );
    if(!messages){
        throw new createHttpError.InternalServerError('Unable to save message');
    };
    return messages;
};

/**
 * 
 * @param senderId 
 * @param receiverId 
 * @returns 
 */
export const updateDelivered = async (messagesIds: string,messageId: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(messageId)) {
    throw new createHttpError.BadRequest("Invalid message id");
  };
  await message.findOneAndUpdate(
    {
      messagesIds,
      "messages._id": messageId,
    },
    { "messages.$.delivered": true },
    { new: true }
  );
  return true;
};

/**
 * 
 * @param senderId 
 * @param receiverId 
 * @returns 
 */
export const findPendingMeassages = async (messagesIds: string) => {
  const messages = await message.aggregate([
    {
      $match: {
        messagesIds
      },
    },
    {
      $project: {
        messages: {
          $filter: {
            input: "$messages",
            as: "message",
            cond: { 
              $eq: ['$$message.delivered', false]
            }
          },
        },
      },
    },
  ]);
  return messages.length > 0 ? messages[0] : [];
};
 
/**
 * 
 * @param userId 
 * @param socketId 
 */
export const saveSocketId = async (userId: string, socketId: string) => {
  if(!Types.ObjectId.isValid(userId)){
    throw new createHttpError.BadRequest('Invalid user id');
  };
  const socket = await connectionIds.findOneAndUpdate(
    { userId },
    { socketId },
    { new: true, upsert: true }
  );
  return socket;
};

/**
 * 
 * @param receiverId 
 * @returns 
 */
export const findReceiverSocketId = async (receiverId: string) => {
  if (!Types.ObjectId.isValid(receiverId)) {
    throw new createHttpError.BadRequest("Invalid receiver id");
  };
  const receiver = await connectionIds.findOne({ userId: receiverId});
  return receiver;
};

/**
 * 
 * @param userId 
 * @returns 
 */
export const deleteConnection = async (userId: string) => {
  if(!Types.ObjectId.isValid(userId)){
    throw new createHttpError.BadRequest("Invalid user id");
  };
  await connectionIds.findOneAndDelete({ userId });
  return true;
};