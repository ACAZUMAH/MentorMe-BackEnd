import { config } from "dotenv";

/**
 * load th env variables and start the whole server
 */
const main = async () => {
    config();
    const start = await import("./servers/server");
    await start.default();
};

main().catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
});