import http from "http";
import { createExpressApp, createSocketServer } from "./servers";
import { logger } from "./logger";
import { connectDB } from "./common/helpers/connectDB";
import client from "./common/helpers/redisConnectDB";
//import applyMiddlewares from "./middlewares";
import applyRouters from "./routers";
import Messaging from "./sockets";
import errorHandler from "./middlewares/error-Handler";
import createError from 'http-errors';

const PORT = process.env.PORT || 3000

/**
 * create the http server here and start the server
 */
export const startServer = async () => {
  await connectDB(String(process.env.DATABASE_URL));

  await client.connect();

  const app = await createExpressApp();

  //await applyMiddlewares(app);

  await applyRouters(app);

  const server = http.createServer(app);

  const io = await createSocketServer(server);

  await Messaging(io);

  app.use(errorHandler);

  app.all("*", (_req, _, next) => {
    return next(createError(404, "unable to retrieve requested resource"));
  });

  server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

export default startServer;
