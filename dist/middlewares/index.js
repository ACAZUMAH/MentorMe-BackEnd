"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const whiteList = ["https://mentor-me-one.vercel.app", `http://localhost:${process.env.PORT}`];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whiteList.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("url not allowed!"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
});
/**
 * apply all meddlewre to the epress to the server
 * @param app the express app
 * @returns the app after applying all middlewares
 */
const applyMiddlewares = async (app) => {
    const mongoStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
    const store = new mongoStore({
        uri: process.env.DATABASE_URL,
        collection: 'sessions'
    });
    store.on('error', (err) => console.log(err));
    app.use((0, express_session_1.default)({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: store
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use((0, cors_1.default)(corsOptions));
    app.use((0, helmet_1.default)());
    app.use((0, xss_clean_1.default)());
    app.use(limiter);
    return app;
};
exports.default = applyMiddlewares;
