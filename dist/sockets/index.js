"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const messages = __importStar(require("../services/messages/message"));
const index_1 = require("../services/users-services/index");
/**
 *
 * @param io
 */
const Messaging = async (io) => {
    io.on("connection", async (socket) => {
        const users = await messages.saveSocketId(socket.user.id, socket.id);
        await sendPending(socket, io);
        await sendMessage(socket, io);
        socket.on("disconnect", async () => {
            await messages.deleteConnection(socket.user.id);
        });
    });
};
/**
 *
 * @param socket
 * @param io
 * @param users
 */
const sendMessage = async (socket, io) => {
    socket.on("sendMessage", async ({ receiverId, message }) => {
        const messagesIds = await (0, index_1.combineIds)(socket.user.id, receiverId);
        const newMessage = await messages.newMesage({
            messagesIds,
            senderId: socket.user.id,
            message,
        });
        const receiverSocket = await messages.findReceiverSocketId(receiverId);
        if (receiverSocket?.socketId) {
            io.to(receiverSocket.socketId).emit("receiveMessage", {
                senderId: socket.user.id,
                message,
            });
            await messages.updateDelivered(messagesIds, newMessage.messages.at(-1)._id);
        }
    });
};
/**
 *
 * @param socket
 * @param io
 * @param users
 */
const sendPending = async (socket, io) => {
    socket.on("join", async ({ senderId }) => {
        const messagesIds = await (0, index_1.combineIds)(senderId, socket.user.id);
        const pendingMessages = await messages.findPendingMeassages(messagesIds);
        const receiverSocket = await messages.findReceiverSocketId(socket.user.id);
        if (pendingMessages) {
            for (const message of pendingMessages.messages) {
                if (message.senderId !== socket.user.id) {
                    io.to(receiverSocket?.socketId).emit("receiveMessage", message);
                    await messages.updateDelivered(messagesIds, message._id);
                }
                ;
            }
            ;
        }
        ;
    });
};
exports.default = Messaging;
