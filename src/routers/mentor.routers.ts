import { Router } from "express";
import * as mentorme from "../controllers/mentors.controller";

const router = Router();

router.get('/requests', mentorme.getMentorshipRequests);

router.post('/accept/:id', mentorme.acceptRequest);

router.post('/reject/:id', mentorme.rejectRequest);

router.get('/mentees', mentorme.rejectRequest);

export default router;