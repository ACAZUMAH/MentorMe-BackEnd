/**
 * @swagger
 * tags:
 *   - name: Mentee Management
 *     description: Routes for managing menoter services.
 */
import { Router } from "express";
import * as mentee from "../controllers/mentees.controller";

const router = Router();

/**
 * @swagger
 * /mentee/request/{id}:
 *   post:
 *     summary: Request Mentorship from a Mentor
 *     tags: [Mentee Management]
 *     description: Allows a mentee to request mentorship from a specific mentor.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the mentor being requested for mentorship.
 *         schema:
 *           type: string
 *           example: "mentor789"
 *     responses:
 *       200:
 *         description: Mentorship request submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     mentorId:
 *                       type: string
 *                       example: "mentor789"
 *                     menteeId:
 *                       type: string
 *                       example: "mentee123"
 *                     status:
 *                       type: string
 *                       example: "pending"
 *       400:
 *         description: Bad Request - Unable to process the mentorship request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unable to request mentorship"
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post("/request/:id", mentee.menteeRequestMentorship);

/**
 * @swagger
 * /mentee/requests:
 *   get:
 *     summary: Get List of Mentorship Requests Made by a Mentee
 *     tags: [Mentee Management]
 *     description: Retrieve a paginated list of mentorship requests made by the authenticated mentee.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for paginated results.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: List of mentorship requests retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       mentorId:
 *                         type: string
 *                         example: "mentor123"
 *                       menteeId:
 *                         type: string
 *                         example: "mentee456"
 *                       status:
 *                         type: string
 *                         example: "pending"
 *       400:
 *         description: No mentorship requests found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No mentorship requests found"
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get("/requests", mentee.getMenteeRequests);

/**
 * @swagger
 * /mentee/request/{id}:
 *   delete:
 *     summary: Cancel a Mentorship Request
 *     tags: [Mentee Management]
 *     description: Allows a mentee to cancel a mentorship request sent to a mentor.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the mentorship request to cancel.
 *         schema:
 *           type: string
 *           example: "mentor123"
 *     responses:
 *       200:
 *         description: Mentorship request canceled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     mentorId:
 *                       type: string
 *                       example: "mentor123"
 *                     menteeId:
 *                       type: string
 *                       example: "mentee456"
 *                     status:
 *                       type: string
 *                       example: "canceled"
 *       400:
 *         description: Bad Request - No request found to cancel.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No mentorship request found"
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.delete("/request/:id", mentee.cancelMentorshipRequest);

// router.get('/mentors', mentee.getMentors);

export default router;
