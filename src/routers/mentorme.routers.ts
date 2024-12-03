import { Router } from "express";
import * as mentorme from "../controllers/mentorme.controller";

const router = Router();

router.get('/mentorsmentees/:role', mentorme.getAllMentorsAllMentees);

export default router;