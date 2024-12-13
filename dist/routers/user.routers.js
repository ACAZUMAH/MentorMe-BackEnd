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
 *   - name: User Management
 *     description: Routes for managing user accounts.
 */
const express_1 = require("express");
const user = __importStar(require("../controllers/user.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /user/profile:
 *   patch:
 *     summary: Update user's profile data.
 *     tags: [User Management]
 *     description: Updates a user's profile data using their ID. Returns the updated profile data if successful or an error message if the update fails.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's full name.
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: "johndoe@example.com"
 *               phone:
 *                 type: string
 *                 description: The user's phone number.
 *                 example: "+1234567890"
 *               address:
 *                 type: string
 *                 description: The user's address.
 *                 example: "123 Main St, Cityville, Country"
 *     responses:
 *       200:
 *         description: User's profile updated successfully.
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
 *                   description: The updated user profile data.
 *                   example:
 *                     id: "62a1c9f734b72c00123abcd"
 *                     name: "John Doe"
 *                     email: "johndoe@example.com"
 *                     phone: "+1234567890"
 *                     address: "123 Main St, Cityville, Country"
 *       400:
 *         description: Unable to update profile.
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
 *                   example: "Unable to update profile"
 *       401:
 *         description: Unauthorized. Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router.patch('/profile', user.updateProfile);
/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get User Profile
 *     description: Retrieves the profile details of the authenticated user.
 *     tags:
 *       - User Management
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile.
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
 *                     id:
 *                       type: string
 *                       example: "user123"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     role:
 *                       type: string
 *                       example: "mentee"
 *                     programmeofStudy:
 *                       type: string
 *                       example: "statistics"
 *                     level:
 *                       type: string
 *                       example: "400"
 *                     about:
 *                       type: string
 *                       example: "Financial analyst with expertise in investment strategies and risk"
 *                     acadamicFields:
 *                       type: array
 *                       example: ["science", "analysis"]
 *       400:
 *         description: No profile found for the user.
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
 *                   example: "No profile found"
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
router.get('/profile', user.getProfile);
/**
 * @swagger
 * /user/mentor-mentee:
 *   get:
 *     summary: Retrieve mentee Mentors or mentor Mentees
 *     tags: [User Management]
 *     description: Returns a list of mentees for a mentor or mentors for a mentee based on the logged-in user's role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: fullName
 *         in: query
 *         required: false
 *         description: Filter mentors or mentees based on a specific user name.
 *         schema:
 *           type: string
 *       - name: programOfStudy
 *         in: query
 *         required: false
 *         description: Filter mentors or mentees based on a specific program of study.
 *         schema:
 *           type: string
 *       - name: level
 *         in: query
 *         required: false
 *         description: Filter mentors or mentees based on their level of study.
 *         schema:
 *           type: string
 *       - name: sort
 *         in: query
 *         required: false
 *         description: sort mentors or mentees base on name, program of study, level, created or updated at.
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Limit the number of results returned.
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: Specify the page number for paginated results.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved mentors or mentees.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "12345"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           role:
 *                             type: string
 *                             example: "mentee"
 *                           email:
 *                             type: string
 *                             example: "johndoe@example.com"
 *                     - type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "No mentees found"
 *       400:
 *         description: Failed to retrieve mentors or mentees.
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
 *                   example: "Could not get data"
 *       401:
 *         description: Unauthorized access.
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
 */
router.get("/mentor-mentee", user.getMyMentorsOrMentees);
/**
 * @swagger
 * /user/mentors-mentees:
 *   get:
 *     summary: Retrieve a list of Mentors or Mentees
 *     tags: [User Management]
 *     description: Returns a list of all mentors or mentees based on the provided role (mentor or mentee).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: role
 *         in: query
 *         required: true
 *         description: Specify the role to retrieve (mentor or mentee).
 *         schema:
 *           type: string
 *           enum: [mentor, mentee]
 *           example: "mentor"
 *       - name: fullName
 *         in: query
 *         required: false
 *         description: Filter mentors or mentees based on a specific user name.
 *         schema:
 *           type: string
 *           example: John Doe
 *       - name: programOfStudy
 *         in: query
 *         required: false
 *         description: Filter mentors or mentees based on a specific program of study.
 *         schema:
 *           type: string
 *           example: computer science
 *       - name: level
 *         in: query
 *         required: false
 *         description: Filter mentors or mentees based on their level of study.
 *         schema:
 *           type: string
 *           example: 400 or professional
 *       - name: sort
 *         in: query
 *         required: false
 *         description: sort mentors or mentees base on name, program of study, level, created or updated at.
 *         schema:
 *           type: string
 *           example: createdAt
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Limit the number of results returned.
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: Specify the page number for paginated results.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of mentors or mentees.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "12345"
 *                           name:
 *                             type: string
 *                             example: "Jane Doe"
 *                           role:
 *                             type: string
 *                             example: "mentor"
 *                           email:
 *                             type: string
 *                             example: "janedoe@example.com"
 *                     - type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "No mentors found"
 *       400:
 *         description: Failed to retrieve mentors or mentees.
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
 *                   example: "Could not get mentors"
 *       401:
 *         description: Unauthorized access.
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
 */
router.get('/mentors-mentees', user.getAllMentorsOrMentees);
/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: Delete a User
 *     tags: [User Management]
 *     description: Deletes a user based on the authenticated user's ID and returns the deleted user's profile data.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully.
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
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *                     email:
 *                       type: string
 *                       example: "janedoe@example.com"
 *       400:
 *         description: Failed to delete the user.
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
 *                   example: "Unable to delete user"
 *       401:
 *         description: Unauthorized access.
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
 */
router.delete('/delete', user.deleteUser);
exports.default = router;
