"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const server_1 = require("../../servers/server");
const sendNotification = (recieverId, notification) => {
    server_1.io.to(recieverId).emit('notification', notification);
};
exports.sendNotification = sendNotification;
