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
exports.default = router;
