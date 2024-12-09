import { Router } from "express";
import * as mentor from "../controllers/mentors.controller";

const router = Router();

router.get('/requests', mentor.getMentorshipRequests);

router.post('/accept/:id', mentor.acceptRequest);

router.post('/reject/:id', mentor.rejectRequest);

// router.get('/mentees', mentorme.getMentees);

// router.get('/mentees', mentorme.getMentees);

export default router;