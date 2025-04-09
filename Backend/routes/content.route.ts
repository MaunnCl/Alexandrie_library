import { Router } from "express";
import { ContentController } from "../controllers/content.controller";
const router = Router();

/**
 * @swagger
 * /contents:
 *   post:
 *     summary: Create a new content
 *     tags: [Contents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *                 nullable: true
 *               url:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Content created successfully
 *       400:
 *         description: Content already exists or invalid input
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
 * /contents/{id}:
 *   put:
 *     summary: Update a content
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the content
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *                 nullable: true
 *               url:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Content updated successfully
 *       404:
 *         description: Content not found
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

export default router;