"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createsocketServer = void 0;
const socket_io_1 = require("socket.io");
const helpers_1 = require("../helpers");
/**
 *
 * @param server
 * @returns
 */
const createsocketServer = async (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    io.use(helpers_1.verifySocketToken);
    return io;
};
exports.createsocketServer = createsocketServer;
exports.default = exports.createsocketServer;
