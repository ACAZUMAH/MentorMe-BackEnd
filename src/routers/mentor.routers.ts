import { Router } from "express";
import * as mentorme from "../controllers/mentors.controller";

const router = Router();

router.get('/mentorsmentees', mentorme.getAllMentorsAndMentees);

export default router;