"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const http_1 = __importDefault(require("http"));
const createExpressApp_1 = __importDefault(require("./createExpressApp"));
const connect_1 = __importDefault(require("../models/connect"));
const redis_1 = __importDefault(require("../models/connect/redis"));
const middlewares_1 = __importDefault(require("../middlewares"));
const routers_1 = __importDefault(require("../routers"));
const createSocketServer_1 = __importDefault(require("./createSocketServer"));
const sockets_1 = __importDefault(require("../sockets"));
const error_Handler_1 = __importDefault(require("../middlewares/error-Handler"));
/**
 * create the http server here and start the server
 */
const startServer = async () => {
    await (0, connect_1.default)(process.env.DATABASE_URL);
    await redis_1.default.connect();
    const app = await (0, createExpressApp_1.default)();
    await (0, middlewares_1.default)(app);
    await (0, routers_1.default)(app);
    const server = http_1.default.createServer(app);
    const io = await (0, createSocketServer_1.default)(server);
    await (0, sockets_1.default)(io);
    app.use(error_Handler_1.default);
    app.all("*", (_req, res) => {
        return res.json({ message: "unable to retrieve requested resource" });
    });
    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};
exports.startServer = startServer;
exports.default = exports.startServer;
