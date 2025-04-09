import { Router } from "express";
import { CongressController } from "../controllers/congress.controller";

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
 *             properties:
 *               name:
 *                 type: string
 *               session_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               picture:
 *                 type: string
 *                 nullable: true
 *               date:
 *                 type: string
 *                 format: date
 *               city:
 *                 type: string
 *     responses:
 *       201:
 *         description: Congress created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/congress", CongressController.create);

/**
 * @swagger
 * /congress:
 *   get:
 *     summary: Get all congresses
 *     tags: [Congress]
 *     responses:
 *       200:
 *         description: Successful retrieval
 */
router.get("/congress", CongressController.getAll);

/**
 * @swagger
 * /congress/{id}:
 *   get:
 *     summary: Get a congress by ID
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
router.get("/congress/:id", CongressController.getById);

/**
 * @swagger
 * /congress/{id}:
 *   put:
 *     summary: Update a congress
 *     tags: [Congress]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the congress
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               session_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               picture:
 *                 type: string
 *                 nullable: true
 *               date:
 *                 type: string
 *                 format: date
 *               city:
 *                 type: string
 *     responses:
 *       200:
 *         description: Congress updated successfully
 *       404:
 *         description: Congress not found
 */
router.put("/congress/:id", CongressController.update);

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
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Congress deleted successfully
 */
router.delete("/congress/:id", CongressController.delete);

export default router;
