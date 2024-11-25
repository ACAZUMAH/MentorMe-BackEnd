import { Router } from "express";
import route from "./auth.routers";

const router = Router();

router.use('/auth', route);

export default router;