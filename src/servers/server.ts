import http from "http";
import createExpressApp from "./createExpressApp";
import connectDB from "../models/connect";

/**
 * create the http server here and start the server
 */
export const startServer = async () => {
    await connectDB(process.env.DATABASE_URL as string);
    const app = await createExpressApp();

    const server = http.createServer(app);

    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};

export default startServer;
