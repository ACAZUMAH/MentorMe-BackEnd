import http from "http";
import createExpressApp from "./createExpressApp";
import connectDB from "../models/connect";
import client from "../models/connect/redis";
import applyMiddlewares from "../middlewares";
import applyRouters from "../routers";
import createsocketServer from "./createSocketServer";
import Messaging from "../sockets";
import errorHandler from "../middlewares/error-Handler";

/**
 * create the http server here and start the server
 */
export const startServer = async () => {
    await connectDB(process.env.DATABASE_URL as string);

    await client.connect();

    const app = await createExpressApp();

    await applyMiddlewares(app);

    await applyRouters(app);

    const server = http.createServer(app);

    const io = await createsocketServer(server);

    await Messaging(io)

    app.use(errorHandler)

    app.all("*", (_req, res) => {
        return res.json({ message: "unable to retrieve requested resource" });
    });

    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};

export default startServer;