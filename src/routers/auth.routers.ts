import { Router } from "express";
import * as auth from "../controllers/auth.controller";

const router = Router();

router.post('/register', auth.createuser);

router.post('/otp', auth.verifyOtp);

router.post('/login', auth.login); 

export default router;