import { Router } from 'express';
import * as mentee from '../controllers/mentees.controller';

const router = Router();

router.post('/request/:id', mentee.menteeRequestMentorship);

router.get('/requests', mentee.getMenteeRequests);

// router.get('/mentors', mentee.getMentors);

export default router;