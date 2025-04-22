import { Router } from "express";
import { SessionController } from "../controllers/session.controller";

const router = Router();

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new session
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Session created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/sessions", SessionController.create);

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Get all sessions
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Successful retrieval of sessions
 */
router.get("/sessions", SessionController.getAll);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get session by ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the session to retrieve
 *     responses:
 *       200:
 *         description: Session found
 *       404:
 *         description: Session not found
 */
router.get("/sessions/:id", SessionController.getById);

/**
 * @swagger
 * /sessions/{id}:
 *   put:
 *     summary: Update session details
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the session to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session updated successfully
 *       404:
 *         description: Session not found
 */
router.put("/sessions/:id", SessionController.update);

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Delete session by ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the session to delete
 *     responses:
 *       204:
 *         description: Session deleted successfully
 *       404:
 *         description: Session not found
 */
router.delete("/sessions/:id", SessionController.delete);

/**
 * @swagger
 * /sessions/{id}/add-content/{contentId}:
 *   patch:
 *     summary: Add a specific content ID to a session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the session to add content to
 *         schema:
 *           type: integer
 *       - in: path
 *         name: contentId
 *         required: true
 *         description: ID of the content to add to the session
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Content ID added successfully
 *       400:
 *         description: Invalid request
 */
router.patch("/sessions/:id/add/:contentId", SessionController.addContentToSession);

/**
 * @swagger
 * /sessions/{id}/remove-content/{contentId}:
 *   patch:
 *     summary: Remove a specific content ID from a session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the session to remove content from
 *         schema:
 *           type: integer
 *       - in: path
 *         name: contentId
 *         required: true
 *         description: ID of the content to remove from the session
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Content ID removed successfully
 *       400:
 *         description: Invalid request
 */
router.patch("/sessions/:id/remove/:contentId", SessionController.removeContentFromSession);

export default router;
