"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const http_1 = __importDefault(require("http"));
const createExpressApp_1 = __importDefault(require("./createExpressApp"));
const connect_1 = __importDefault(require("../models/connect"));
/**
 * create the http server here and start the server
 */
const startServer = async () => {
    await (0, connect_1.default)(process.env.DATABASE_URL);
    const app = await (0, createExpressApp_1.default)();
    const server = http_1.default.createServer(app);
    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};
exports.startServer = startServer;
exports.default = exports.startServer;
