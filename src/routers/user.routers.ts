import { Router } from "express";
import * as user from "../controllers/user.controller";
import { verifyAccessToken } from "../helpers";

const router = Router();

router.post('/profile', verifyAccessToken, user.createprofile);


export default router;