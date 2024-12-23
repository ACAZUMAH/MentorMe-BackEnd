import { Router } from "express";
import * as mentor from "../controllers/mentors.controller";

const router = Router();

router.get("/requests", mentor.getMentorshipRequests);

router.put("/accept/:id", mentor.acceptRequest);

router.put("/reject/:id", mentor.rejectRequest);

router.post('/resources', mentor.uploadResources);

router.get('/resources', mentor.getMentorUploadedResources);

router.delete('/resources/:id', mentor.deleteResources);

export default router;
