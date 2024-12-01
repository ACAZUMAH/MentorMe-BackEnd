import { Router } from "express";
require('../services/auth-services/Oauth2/index');
import passport from "passport";
import { verifyAccessToken } from "../helpers";
import * as auth from "../controllers/auth.controller";

const router = Router();

router.get(
    '/google', 
    passport.authenticate(
        'google', 
        { scope: ['email', 'profile'] }
    )
);

router.get(
    '/google/redirect', 
    passport.authenticate('google'), 
    auth.googleAuth
);

router.post('/register', auth.createuser);

router.post('/otp', auth.verifyOtp);

router.post('/login', auth.login); 

router.post('/forget-password', auth.forgotPassword);  

router.post('/new-password', verifyAccessToken, auth.newPassword);

export default router;