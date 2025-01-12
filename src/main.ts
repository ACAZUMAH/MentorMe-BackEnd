import { config } from "dotenv";
import { logger, rollbar } from "./logger";

/**
 * load th env variables and start the whole server
 */
const main = async () => {
    config();
    const start = await import("./app");
    await start.default();
};

main().catch(err => {
    logger.error(err);
    rollbar.error('An unhandled error occurred', err)
    process.exit(1);
});