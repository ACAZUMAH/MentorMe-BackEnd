/**
 * @swagger
 * tags:
 *   - name: Mentor Management
 *     description: Routes for managing menoter services.
 */
import { Router } from "express";
import * as mentor from "../controllers/mentors.controller";

const router = Router();

/**
 * @swagger
 * /mentor/requests:
 *   get:
 *     summary: Retrieve Mentorship Requests
 *     tags: [Mentor Management]
 *     description: Allows a mentor to view all pending mentorship requests.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved mentorship requests.
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
 *                       requestId:
 *                         type: string
 *                         example: "req12345"
 *                       menteeId:
 *                         type: string
 *                         example: "mentee123"
 *                       mentorId:
 *                         type: string
 *                         example: "mentor789"
 *                       status:
 *                         type: string
 *                         example: "pending"
 *       400:
 *         description: Bad Request - Unable to process the request.
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
router.get("/requests", mentor.getMentorshipRequests);

/**
 * @swagger
 * /mentor/accept/{id}:
 *   put:
 *     summary: Accept a Mentorship Request
 *     tags: [Mentor Management]
 *     description: Allows a mentor to accept a mentorship request from a specific mentee.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the mentee whose request is being accepted.
 *         schema:
 *           type: string
 *           example: "d1h3j43h54k6io6i9fg3466gdfghg"
 *     responses:
 *       200:
 *         description: Mentorship request accepted successfully.
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
 *                       example: "accepted"
 *       400:
 *         description: Bad Request - Unable to accept the mentorship request.
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
 *                   example: "Unable to accept request"
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
router.put("/accept/:id", mentor.acceptRequest);

/**
 * @swagger
 * /mentor/reject/{id}:
 *   put:
 *     summary: Reject a Mentorship Request
 *     tags: [Mentor Management]
 *     description: Allows a mentor to reject a mentorship request from a specific mentee.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the mentee whose request is being rejected.
 *         schema:
 *           type: string
 *           example: "mentee123"
 *     responses:
 *       200:
 *         description: Mentorship request rejected successfully.
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
 *                       example: "rejected"
 *       400:
 *         description: Bad Request - Unable to reject the mentorship request.
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
 *                   example: "Unable to reject request"
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
router.put("/reject/:id", mentor.rejectRequest);

export default router;
