import { Router } from "express";
import * as user from "../controllers/user.controller";

const router = Router();

router.post('/profile', user.createProfile);

export default router;