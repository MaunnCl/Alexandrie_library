import { Router } from "express";
import { CongressController } from "../controllers/congress.controller";
import { authenticateJWT } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /congress:
 *   post:
 *     summary: Create a new congress
 *     tags: [Congress]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - key
 *               - date
 *               - city
 *             properties:
 *               name:
 *                 type: string
 *               key:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               city:
 *                 type: string
 *               picture:
 *                 type: string
 *     responses:
 *       201:
 *         description: Congress created successfully
 */
router.post("/congress", authenticateJWT, CongressController.create);

/**
 * @swagger
 * /congress:
 *   get:
 *     summary: Get all congress
 *     tags: [Congress]
 *     responses:
 *       200:
 *         description: Successful retrieval
 */
router.get("/congress", authenticateJWT, CongressController.getAll);

/**
 * @swagger
 * /congress/{id}:
 *   get:
 *     summary: Get congress by ID
 *     tags: [Congress]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the congress
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Congress found
 *       404:
 *         description: Congress not found
 */
router.get("/congress/:id", authenticateJWT, CongressController.getById);

/**
 * @swagger
 * /congress/{id}:
 *   put:
 *     summary: Update congress
 *     tags: [Congress]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the congress to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               key:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               city:
 *                 type: string
 *               picture:
 *                 type: string
 *     responses:
 *       200:
 *         description: Congress updated successfully
 */
router.put("/congress/:id", authenticateJWT, CongressController.update);

/**
 * @swagger
 * /congress/{id}:
 *   delete:
 *     summary: Delete a congress
 *     tags: [Congress]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the congress to delete
 *     responses:
 *       204:
 *         description: Congress deleted successfully
 */
router.delete("/congress/:id", authenticateJWT, CongressController.delete);

/**
 * @swagger
 * /congress/{congressId}/session/{sessionId}:
 *   post:
 *     summary: Add a session to a congress
 *     tags: [Congress]
 *     parameters:
 *       - in: path
 *         name: congressId
 *         required: true
 *         description: ID of the congress
 *         schema:
 *           type: integer
 *       - in: path
 *         name: sessionId
 *         required: true
 *         description: ID of the session to add to the congress
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Session added to congress successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session added to congress"
 *                 congress:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "International AI Congress 2025"
 *                     key:
 *                      type: string
 *                     session_ids:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [1, 2, 3]
 *                     picture:
 *                       type: string
 *                       example: "https://example.com/congress-picture.jpg"
 *                     date:
 *                       type: string
 *                       example: "2025-06-12"
 *                     city:
 *                       type: string
 *                       example: "Paris"
 *       400:
 *         description: Session already exists in the congress
 *       404:
 *         description: Congress or Session not found
 *       500:
 *         description: Server error
 */
router.post("/congress/:congressId/session/:sessionId", authenticateJWT, CongressController.addSessionToCongress);

/**
 * @swagger
 * /congress/{congressId}/session/{sessionId}:
 *   delete:
 *     summary: Remove a session from a congress
 *     tags: [Congress]
 *     parameters:
 *       - in: path
 *         name: congressId
 *         required: true
 *         description: ID of the congress
 *         schema:
 *           type: integer
 *       - in: path
 *         name: sessionId
 *         required: true
 *         description: ID of the session to remove from the congress
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Session removed from congress successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session removed from congress"
 *                 congress:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "International AI Congress 2025"
 *                     key:
 *                      type: string
 *                     session_ids:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [1, 3]
 *                     picture:
 *                       type: string
 *                       example: "https://example.com/congress-picture.jpg"
 *                     date:
 *                       type: string
 *                       example: "2025-06-12"
 *                     city:
 *                       type: string
 *                       example: "Paris"
 *       400:
 *         description: Session not found in the congress
 *       404:
 *         description: Congress or Session not found
 *       500:
 *         description: Server error
 */
router.delete("/congress/:congressId/session/:sessionId", authenticateJWT, CongressController.removeSessionFromCongress);

export default router;
