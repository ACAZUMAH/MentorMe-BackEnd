"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Routes for user authentication
 */
require("../services/auth-services/Oauth2/index");
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const helpers_1 = require("../helpers");
const auth = __importStar(require("../controllers/auth.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: continuing with Google
 *     description: Initiates the Google OAuth2 login process. The user is redirected to Google's login page.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google's OAuth login page.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the request was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: A failure message indicating an internal error.
 *                   example: "Internal server error"
 */
router.get("/google", passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
router.get("/google/redirect", passport_1.default.authenticate("google"), auth.googleAuth);
router.post("/register", auth.createUser);
router.post("/otp", auth.verifyOtp);
router.post("/login", auth.login);
router.post("/forget-password", auth.forgotPassword);
router.post("/new-password", helpers_1.verifyAccessToken, auth.newPassword);
router.get("/logout", helpers_1.verifyAccessToken, auth.logOut);
exports.default = router;
