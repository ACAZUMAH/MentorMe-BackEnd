"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * tags:
 *   - name: Mentee Management
 *     description: Routes for managing mentee services.
 */
const express_1 = require("express");
const mentee = __importStar(require("../controllers/mentees.controller"));
const router = (0, express_1.Router)();
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
/**
 * @swagger
 * /mentee/resources:
 *   get:
 *     summary: Get Uploaded Resources
 *     description: Allows mentees to retrieve general and forwarded uploaded resources.
 *     tags:
 *       - Mentee Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for paginated resources.
 *         schema:
 *           type: string
 *           example: "1"
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of resources to return per page.
 *         schema:
 *           type: string
 *           example: "10"
 *     responses:
 *       200:
 *         description: Successfully retrieved uploaded resources.
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
 *                       _id:
 *                         type: string
 *                         example: "resource1234"
 *                       title:
 *                         type: string
 *                         example: "Introduction to TypeScript"
 *                       uploadedBy:
 *                         type: string
 *                         example: "mentor123"
 *                       resources_url:
 *                         type: string
 *                         example: "https://example.com/resources/nodejs"
 *       404:
 *         description: No uploaded resources found.
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
 *                   example: "No uploaded resources found"
 *       401:
 *         description: Unauthorized - User not authenticated.
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
router.get('/resources', mentee.getUploadedResources);
/**
 * @swagger
 * /mentee/bookmark/{id}:
 *   put:
 *     summary: Bookmark a Resource
 *     description: Allows a mentee to bookmark a specific resource.
 *     tags:
 *       - Mentee Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the resource to be bookmarked.
 *         schema:
 *           type: string
 *           example: "resource123"
 *     responses:
 *       200:
 *         description: Successfully bookmarked the resource.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 bookmark:
 *                   type: string
 *                   example: "bookmarked"
 *       400:
 *         description: Unable to bookmark resources.
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
 *                   example: "Unable to bookmark resources"
 *       401:
 *         description: Unauthorized - User not authenticated.
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
router.put('/bookmark/:id', mentee.bookmarkResources);
/**
 * @swagger
 * /mentee/bookmarks:
 *   get:
 *     summary: Get Bookmarked Resources
 *     description: Retrieves all resources bookmarked by the authenticated mentee.
 *     tags:
 *       - Mentee Management
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of bookmarked resources.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 bookmarked:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "resource123"
 *                       uploadedBy:
 *                         type: string
 *                         example: "mentor1234"
 *                       title:
 *                         type: string
 *                         example: "Intro to Programming"
 *                       resources_url:
 *                         type: string
 *                         example: "https://example.com/resources/programming"
 *       404:
 *         description: No bookmarked resources found.
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
 *                   example: "No bookmarked resources yet"
 *       401:
 *         description: Unauthorized - User not authenticated.
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
router.get('/bookmarks', mentee.getBookmarkedResources);
exports.default = router;
