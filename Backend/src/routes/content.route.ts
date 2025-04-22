import { Router } from "express";
import { ContentController } from "../controllers/content.controller";
const router = Router();

/**
 * @swagger
 * /content:
 *   post:
 *     summary: Create a new content
 *     tags: [Contents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - orator_id
 *               - description
 *               - url
 *             properties:
 *               title:
 *                 type: string
 *               orator_id:
 *                 type: integer
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Content created successfully
 */
router.post("/contents", ContentController.create);

/**
 * @swagger
 * /contents:
 *   get:
 *     summary: Get all contents
 *     tags: [Contents]
 *     responses:
 *       200:
 *         description: Successful retrieval
 */
router.get("/contents", ContentController.getAll);

/**
 * @swagger
 * /contents/{id}:
 *   get:
 *     summary: Get a content by ID
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the content
 *     responses:
 *       200:
 *         description: Content found
 *       404:
 *         description: Content not found
 */
router.get("/contents/:id", ContentController.getById);

/**
 * @swagger
 * /content/{id}:
 *   put:
 *     summary: Update content
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the content to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               orator_id:
 *                 type: integer
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Content updated successfully
 */
router.put("/contents/:id", ContentController.update);

/**
 * @swagger
 * /contents/{id}:
 *   delete:
 *     summary: Delete a content
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the content
 *     responses:
 *       204:
 *         description: Content deleted successfully
 */
router.delete("/contents/:id", ContentController.delete);

/**
 * @swagger
 * /content/{contentId}/orator/{oratorId}:
 *   put:
 *     summary: Link content to an orator
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         description: ID of the content to link
 *       - in: path
 *         name: oratorId
 *         required: true
 *         description: ID of the orator
 *     responses:
 *       200:
 *         description: Content linked to orator successfully
 */
router.put("/contents/:contentId/orator/:oratorId", ContentController.addContentToOrator);

/**
 * @swagger
 * /content/{contentId}/orator:
 *   delete:
 *     summary: Remove content from an orator
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         description: ID of the content to unlink
 *     responses:
 *       200:
 *         description: Content removed from orator successfully
 */
router.delete("/contents/:contentId/orator", ContentController.removeContentFromOrator);

export default router;