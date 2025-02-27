import { Router } from "express";
import { ContentController } from "../controllers/content.controller";

const router = Router();

/**
 * @swagger
 * /contents:
 *   post:
 *     summary: Create a new content item
 *     description: Add a new content entry to the system
 *     tags: [Content]
 *     responses:
 *       201:
 *         description: Content created successfully
 *       400:
 *         description: Bad request
 */
router.post("/contents", ContentController.create);

/**
 * @swagger
 * /contents:
 *   get:
 *     summary: Get all content items
 *     description: Retrieve a list of all content entries
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: Successful retrieval
 *       400:
 *         description: Bad request
 */
router.get("/contents", ContentController.getAll);

/**
 * @swagger
 * /contents/:{id}:
 *   get:
 *     summary: Get content by ID
 *     description: Retrieve a specific content entry
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the content entry
 *     responses:
 *       200:
 *         description: Successful retrieval
 *       400:
 *         description: Bad request
 */
router.get("/contents/:id", ContentController.getById);

router.put("/contents/:id", ContentController.update);

/**
 *  @swagger
 *  /contents/{id}:
 *  delete:
 *      summary: Delete a content
 *      tags: [Content]
 *      description: Remove a content from the system
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the content to delete
 *          schema:
 *            type: integer
 *      responses:
 *        204:
 *          description: Successfully deleted
 *        404:
 *          description: Category not found
*/
router.delete("/contents/:id", ContentController.delete);

export default router;
