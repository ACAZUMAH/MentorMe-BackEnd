import { Router } from "express";
import * as mentee from "../controllers/mentees.controller";

const router = Router();

router.post("/request/:id", mentee.menteeRequestMentorship);

router.get("/requests", mentee.getMenteeRequests);

router.delete("/request/:id", mentee.cancelMentorshipRequest);

router.get('/resources', mentee.getUploadedResources);

router.get('/MentorMe/resources', mentee.getMentorMeResources);

router.put('/bookmark/:id', mentee.bookmarkResources);

router.get('/bookmarks', mentee.getBookmarkedResources);

router.patch("/bookmark/:id", mentee.removeBookMarkedResource);

export default router;
