import { Server } from 'socket.io';


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

    io.on('connection', (socket) => {
        socket.on('join' , (room) => {
            socket.join(room);
        });

        socket.on('disconnect', () => {
        });
    })

    return io;
};

export default createsocketServer;