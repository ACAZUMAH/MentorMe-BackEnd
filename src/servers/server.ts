import http from "http";
import createExpressApp from "./createExpressApp";
import connectDB from "../models/connect";
import client from "../models/connect/redis";
import createsocketServer from "./createSocketServer";
import Messaging from "../sockets";

/**
 * create the http server here and start the server
 */
export const startServer = async () => {
    await connectDB(process.env.DATABASE_URL as string);
    await client.connect();
    const app = await createExpressApp();
    const server = http.createServer(app);
    const io = await createsocketServer(server);
    await Messaging(io)
    server.listen(process.env.PORT || 3500, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};

export default startServer;