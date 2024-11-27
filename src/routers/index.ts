import { Router } from "express";
import route from "./auth.routers";
import userRoute from "./user.routers";

const router = Router();

router.use('/auth', route);
router.use("/user", userRoute);

export default router;