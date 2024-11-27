import { Router } from "express";
import authRoute from "./auth.routers";
//import UserRouter from "./user.routers";

const router = Router();

router.use('/auth', authRoute);
//router.use('/user', UserRouter);

export default router;