import * as messages from "../services/messages/message";
import { combineIds } from "../services/users-services/index";

/**
 *
 * @param io
 */
const Messaging = async (io: any) => {
  io.on("connection", async (socket: any) => {
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
const sendMessage = async (socket: any, io: any) => {
  socket.on("sendMessage", async ({ receiverId, message }) => {
    const messagesIds = await combineIds(socket.user.id, receiverId);
    const newMessage: any = await messages.newMesage({
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
      await messages.updateDelivered(
        messagesIds,
        newMessage.messages.at(-1)._id
      );
    }
  });
};

/**
 *
 * @param socket
 * @param io
 * @param users
 */
const sendPending = async (socket: any, io: any) => {
  socket.on("join", async ({ senderId }) => {
    const messagesIds = await combineIds(senderId, socket.user.id);
    const pendingMessages: any = await messages.findPendingMeassages(
      messagesIds,
    );
    const receiverSocket = await messages.findReceiverSocketId(socket.user.id);
    if (pendingMessages.messages) {
      for(const message of pendingMessages.messages){
        if(message.senderId !== socket.user.id){
          io.to(receiverSocket?.socketId).emit("receiveMessage", message);
          await messages.updateDelivered(messagesIds, message._id);
        };
      };
    };
  });
};

export default Messaging;
