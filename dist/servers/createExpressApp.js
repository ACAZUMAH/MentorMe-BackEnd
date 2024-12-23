"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('express-async-errors');
require('../services/types');
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const routers_1 = __importDefault(require("../routers"));
const error_Handler_1 = __importDefault(require("../middlewares/error-Handler"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const passport_1 = __importDefault(require("passport"));
const docs_1 = __importDefault(require("../docs"));
const redis_1 = __importDefault(require("../models/connect/redis"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const createExpressApp = async () => {
    const redisStore = (0, connect_redis_1.default)(express_session_1.default);
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100
    });
    const app = (0, express_1.default)();
    app.set('trust proxy', 1);
    app.use(express_1.default.json());
    app.use((0, express_session_1.default)({
        store: new redisStore({ client: redis_1.default }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use(limiter);
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use((0, xss_clean_1.default)());
    app.get("/", (_req, res) => {
        res.status(200).send("<a href='/api-docs'>docs</a>");
    });
    app.use(routers_1.default);
    await (0, docs_1.default)(app);
    app.use(error_Handler_1.default);
    app.all('*', (_req, res) => {
        return res.json({ message: 'unable to retrieve requested resource' });
    });
    return Promise.resolve(app);
};
exports.default = createExpressApp;
