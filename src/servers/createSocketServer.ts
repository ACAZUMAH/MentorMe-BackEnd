import { Server } from 'socket.io';
import { verifySocketToken } from '../helpers';


/**
 * 
 * @param server 
 * @returns 
 */
export const createsocketServer = async (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    io.use(verifySocketToken);
    return io;
};

export default createsocketServer;
