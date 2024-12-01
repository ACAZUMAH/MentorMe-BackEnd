import { Router } from "express";
import authRoute from "./auth.routers";
import userRoute from "./user.routers";


const router = Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);


export default router;