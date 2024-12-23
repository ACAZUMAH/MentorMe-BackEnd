/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Routes for user authentication
 */
require("../services/auth-services/Oauth2/index");
import { Router } from "express";
import passport from "passport";
import { verifyAccessToken } from "../helpers";
import * as auth from "../controllers/auth.controller";

const router = Router();

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
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  auth.googleAuth
);

router.post("/register", auth.createUser);

router.post("/otp", auth.verifyOtp);

router.post("/login", auth.login);

router.post("/forget-password", auth.forgotPassword);

router.post("/new-password", verifyAccessToken, auth.newPassword);

router.get("/logout", verifyAccessToken, auth.logOut);

export default router;
