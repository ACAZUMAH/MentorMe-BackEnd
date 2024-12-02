import { Router } from "express";
import * as user from "../controllers/user.controller";

const router = Router();

router.patch('/profile', user.updateProfile);
router.get("/my-mentor-mentee", user.getMyMentorMentee)

export default router;