"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routers_1 = __importDefault(require("./auth.routers"));
const user_routers_1 = __importDefault(require("./user.routers"));
const mentee_router_1 = __importDefault(require("./mentee.router"));
const mentor_routers_1 = __importDefault(require("./mentor.routers"));
const helpers_1 = require("../helpers");
const applyRouters = async (app) => {
    app.use("/auth", auth_routers_1.default);
    app.use("/user", helpers_1.verifyAccessToken, user_routers_1.default);
    app.use("/mentee", helpers_1.verifyAccessToken, mentee_router_1.default);
    app.use("/mentor", helpers_1.verifyAccessToken, mentor_routers_1.default);
    return app;
};
exports.default = applyRouters;
