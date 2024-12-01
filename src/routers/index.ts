import { Router } from "express";
import route from "./auth.routers";
import UserRouter from "./user.routers";

const router = Router();

router.use('/auth', route);
router.use('/user', UserRouter);

export default router;