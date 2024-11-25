"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('express-async-errors');
const express_1 = __importDefault(require("express"));
const routers_1 = __importDefault(require("../routers"));
const error_Handler_1 = __importDefault(require("../middlewares/error-Handler"));
const createExpressApp = async () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(routers_1.default);
    app.use(error_Handler_1.default);
    app.all('*', (req, res) => {
        res.json({ message: 'unable to retrieve requested resource' });
    });
    return Promise.resolve(app);
};
exports.default = createExpressApp;
