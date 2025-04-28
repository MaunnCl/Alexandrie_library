"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const content_controller_1 = require("../controllers/content.controller");
const router = (0, express_1.Router)();
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
router.post("/contents", content_controller_1.ContentController.create);
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
router.get("/contents", content_controller_1.ContentController.getAll);
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
router.get("/contents/:id", content_controller_1.ContentController.getById);
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
router.put("/contents/:id", content_controller_1.ContentController.update);
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
router.delete("/contents/:id", content_controller_1.ContentController.delete);
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
router.put("/contents/:contentId/orator/:oratorId", content_controller_1.ContentController.addContentToOrator);
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
router.delete("/contents/:contentId/orator", content_controller_1.ContentController.removeContentFromOrator);
exports.default = router;
