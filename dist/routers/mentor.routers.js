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
 *   - name: Mentor Management
 *     description: Routes for managing mentor services.
 */
const express_1 = require("express");
const mentor = __importStar(require("../controllers/mentors.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /mentor/requests:
 *   get:
 *     summary: Retrieve Mentorship Requests
 *     tags: [Mentor Management]
 *     description: Allows a mentor to view all pending mentorship requests.
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
/**
 * @swagger
 * /mentor/resources:
 *   post:
 *     summary: Upload Resources
 *     description: Allows a mentor to upload resources for mentees.
 *     tags: [Mentor Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Introduction to Node.js"
 *               resources_url:
 *                 type: string
 *                 example: "https://example.com/resources/nodejs"
 *               forward_to_mentees:
 *                 type: array
 *                 example: ["mentee123","mentee345894"]
 *             required:
 *               - title
 *               - resources_url
 *     responses:
 *       201:
 *         description: Resource uploaded successfully.
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
 *                     uploadedBy:
 *                       type: string
 *                       example: "mentor456"
 *                     title:
 *                       type: string
 *                       example: "Introduction to Node.js"
 *                     resources_url:
 *                       type: string
 *                       example: "https://example.com/resources/nodejs"
 *       400:
 *         description: Bad Request - Missing or invalid input.
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
 *                   example: "Invalid input data"
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
router.post('/resources', mentor.uploadResources);
/**
 * @swagger
 * /mentor/resources:
 *   get:
 *     summary: Get Uploaded Resources
 *     description: Allows a mentor to retrieve all the resources they have uploaded.
 *     tags:
 *       - Mentor Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number for pagination.
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: The number of results per page.
 *         schema:
 *           type: integer
 *           example: 10
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
 *                         example: "resource123"
 *                       uploadedBy:
 *                         type: string
 *                         example: "mentor456"
 *                       title:
 *                         type: string
 *                         example: "Introduction to Node.js"
 *                       resources_url:
 *                         type: string
 *                         example: "https://example.com/resources/nodejs"
 *       404:
 *         description: No resources found for the mentor.
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
 *                   example: "You have no uploaded resources yet"
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
router.get('/resources', mentor.getMentorUploadedResources);
/**
 * @swagger
 * /mentor/resources/{id}:
 *   delete:
 *     summary: Delete Uploaded Resource
 *     description: Allows a mentor to delete an uploaded resource by its ID.
 *     tags:
 *       - Mentor Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the resource to delete.
 *         schema:
 *           type: string
 *           example: "resource123"
 *     responses:
 *       200:
 *         description: Resource successfully deleted.
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
 *                     _id:
 *                       type: string
 *                       example: "resource123"
 *                     uploadedBy:
 *                       type: string
 *                       example: "mentor456"
 *                     title:
 *                       type: string
 *                       example: "Introduction to Node.js"
 *                     resources_url:
 *                       type: string
 *                       example: "https://example.com/resources/nodejs"
 *       404:
 *         description: Resource not found.
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
 *                   example: "Resources not found"
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
router.delete('/resources/:id', mentor.deleteResources);
exports.default = router;
