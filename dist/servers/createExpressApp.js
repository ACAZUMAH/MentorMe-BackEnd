"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('express-async-errors');
require('../services/types');
const express_1 = __importDefault(require("express"));
const docs_1 = __importDefault(require("../docs"));
const createExpressApp = async () => {
    const app = (0, express_1.default)();
    app.set('trust proxy', 1);
    app.use(express_1.default.json());
    app.get("/", (_req, res) => {
        res.status(200).send("<a href='/api-docs'>docs</a>");
    });
    await (0, docs_1.default)(app);
    return Promise.resolve(app);
};
exports.default = createExpressApp;
