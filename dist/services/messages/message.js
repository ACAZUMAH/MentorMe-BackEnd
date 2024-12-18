"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConnection = exports.findReceiverSocketId = exports.saveSocketId = exports.findPendingMeassages = exports.updateDelivered = exports.newMesage = void 0;
const mongoose_1 = require("mongoose");
const messages_1 = __importDefault(require("../../models/schemas/messages"));
const connectionIds_1 = __importDefault(require("../../models/schemas/connectionIds"));
const validate_message_1 = __importDefault(require("./validate-message"));
const http_errors_1 = __importDefault(require("http-errors"));
/**
 * add a new message to the sender and receiver database
 * @param data
 * @returns
 */
const newMesage = async (data) => {
    await (0, validate_message_1.default)(data);
    const messages = await messages_1.default.findOneAndUpdate({ messagesIds: data.messagesIds }, { $addToSet: { messages: { ...data } } }, { new: true, upsert: true });
    if (!messages) {
        throw new http_errors_1.default.InternalServerError('Unable to save message');
    }
    ;
    return messages;
};
exports.newMesage = newMesage;
/**
 *
 * @param senderId
 * @param receiverId
 * @returns
 */
const updateDelivered = async (messagesIds, messageId) => {
    if (!mongoose_1.Types.ObjectId.isValid(messageId)) {
        throw new http_errors_1.default.BadRequest("Invalid message id");
    }
    ;
    await messages_1.default.findOneAndUpdate({
        messagesIds,
        "messages._id": messageId,
    }, { "messages.$.delivered": true }, { new: true });
    return true;
};
exports.updateDelivered = updateDelivered;
/**
 *
 * @param senderId
 * @param receiverId
 * @returns
 */
const findPendingMeassages = async (messagesIds) => {
    const messages = await messages_1.default.aggregate([
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
exports.findPendingMeassages = findPendingMeassages;
/**
 *
 * @param userId
 * @param socketId
 */
const saveSocketId = async (userId, socketId) => {
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new http_errors_1.default.BadRequest('Invalid user id');
    }
    ;
    const socket = await connectionIds_1.default.findOneAndUpdate({ userId }, { socketId }, { new: true, upsert: true });
    return socket;
};
exports.saveSocketId = saveSocketId;
/**
 *
 * @param receiverId
 * @returns
 */
const findReceiverSocketId = async (receiverId) => {
    if (!mongoose_1.Types.ObjectId.isValid(receiverId)) {
        throw new http_errors_1.default.BadRequest("Invalid receiver id");
    }
    ;
    const receiver = await connectionIds_1.default.findOne({ userId: receiverId });
    return receiver;
};
exports.findReceiverSocketId = findReceiverSocketId;
/**
 *
 * @param userId
 * @returns
 */
const deleteConnection = async (userId) => {
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new http_errors_1.default.BadRequest("Invalid user id");
    }
    ;
    await connectionIds_1.default.findOneAndDelete({ userId });
    return true;
};
exports.deleteConnection = deleteConnection;
