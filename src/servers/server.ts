import http from "http";
import createExpressApp from "./createExpressApp";
import connectDB from "../models/connect";
import client from "../models/connect/redis";
import createsocketServer from "./createSocketServer";

let io: any;
/**
 * create the http server here and start the server
 */
export const startServer = async () => {
    await connectDB(process.env.DATABASE_URL as string);
    await client.connect();
    const app = await createExpressApp();
    const server = http.createServer(app);
    io = await createsocketServer(server);
    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};

export default startServer;
export { io };