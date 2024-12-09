/**
 * @swagger
 * tags:
 *   - name: User Management
 *     description: Routes for managing user accounts.
 */
import { Router } from "express";
import * as user from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * user/profile:
 *   patch:
 *     summary: Update user's profile data.
 *     tags:
 *       - User
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

router.get("/my-mentor-mentee", user.getMyMentorsOrMentees);

router.get('/mentors-mentees', user.getAllMentorsOrMentees);

router.delete('delete/', user.deleteUser);

export default router;