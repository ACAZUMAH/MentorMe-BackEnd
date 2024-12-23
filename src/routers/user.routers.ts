import { Router } from "express";
import * as user from "../controllers/user.controller";

const router = Router();

router.patch('/profile', user.updateProfile);

router.get('/profile', user.getProfile)

router.get("/mentor-mentee", user.getMyMentorsOrMentees);

router.get('/mentors-mentees', user.getAllMentorsOrMentees);

router.delete('/delete', user.deleteUser);

export default router;