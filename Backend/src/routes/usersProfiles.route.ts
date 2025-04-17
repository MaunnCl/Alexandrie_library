import { Router } from "express";
import { UsersProfilesController } from "../controllers/usersProfiles.controller";

const router = Router();

/**
 * @swagger
 * /users-profiles:
 *   post:
 *     summary: Create a new user profile
 *     tags: [UsersProfiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               profilePicture:
 *                 type: string
 *               bio:
 *                 type: string
 *               preferences:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/users-profiles", UsersProfilesController.create);

/**
 * @swagger
 * /users-profiles:
 *   get:
 *     summary: Get all user profiles
 *     tags: [UsersProfiles]
 *     responses:
 *       200:
 *         description: Successful retrieval
 */
router.get("/users-profiles", UsersProfilesController.getAll);

/**
 * @swagger
 * /users-profiles/{id}:
 *   get:
 *     summary: Get a user profile by ID
 *     tags: [UsersProfiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user profile
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile found
 *       404:
 *         description: Profile not found
 */
router.get("/users-profiles/:id", UsersProfilesController.getById);

/**
 * @swagger
 * /users-profiles/{id}:
 *   put:
 *     summary: Update a user profile
 *     tags: [UsersProfiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user profile
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *               bio:
 *                 type: string
 *               preferences:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: Profile not found
 */
router.put("/users-profiles/:id", UsersProfilesController.update);

/**
 * @swagger
 * /users-profiles/{id}:
 *   delete:
 *     summary: Delete a user profile
 *     tags: [UsersProfiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user profile
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Profile deleted successfully
 */
router.delete("/users-profiles/:id", UsersProfilesController.delete);

export default router;
