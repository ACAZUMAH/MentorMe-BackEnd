import { Router } from "express";
import authRoutes from "./auth.routers";
import userRoutes from "./user.routers";
import menteeroutes from "./mentee.router";
import mentorRoutes from "./mentor.routers"
import { deleteUser } from "../controllers/user.controller";
import { verifyAccessToken } from "../helpers";

const router = Router();

router.use('/auth', authRoutes);

router.use('/user', verifyAccessToken, userRoutes);

router.use('/mentee', verifyAccessToken, menteeroutes);

router.use("/mentor", verifyAccessToken, mentorRoutes);

export default router;