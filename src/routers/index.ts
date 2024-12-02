import { Router } from "express";
import authRoute from "./auth.routers";
import userRoute from "./user.routers";
import { verifyAccessToken } from "../helpers";

const router = Router();

router.use('/auth', authRoute);
router.use('/user', verifyAccessToken, userRoute);


export default router;