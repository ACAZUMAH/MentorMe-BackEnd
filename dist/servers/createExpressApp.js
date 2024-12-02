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
const passport_1 = __importDefault(require("passport"));
const createExpressApp = async () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, express_session_1.default)({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use(routers_1.default);
    app.use(error_Handler_1.default);
    app.all('*', (_req, res) => {
        return res.json({ message: 'unable to retrieve requested resource' });
    });
    return Promise.resolve(app);
};
exports.default = createExpressApp;
