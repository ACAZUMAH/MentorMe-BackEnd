import { Server } from 'socket.io';
import { verifySocketToken } from '../common/helpers/index';


/**
 * 
 * @param server 
 * @returns 
 */
export const createSocketServer = async (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    io.use(verifySocketToken);
    return io;
};

