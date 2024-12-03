"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routers_1 = __importDefault(require("./auth.routers"));
const user_routers_1 = __importDefault(require("./user.routers"));
const mentor_routers_1 = __importDefault(require("./mentor.routers"));
const helpers_1 = require("../helpers");
const router = (0, express_1.Router)();
router.use('/auth', auth_routers_1.default);
router.use('/user', helpers_1.verifyAccessToken, user_routers_1.default);
router.use("/mentorme", helpers_1.verifyAccessToken, mentor_routers_1.default);
exports.default = router;
