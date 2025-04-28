"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orators_controller_1 = require("../controllers/orators.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /orators:
 *   post:
 *     summary: Create a new orator
 *     tags: [Orators]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               picture:
 *                 type: string
 *                 nullable: true
 *               content_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       201:
 *         description: Orator created successfully
 *       400:
 *         description: Orator already exists or invalid input
 */
router.post("/orators", orators_controller_1.OratorsController.create);
/**
 * @swagger
 * /orators:
 *   get:
 *     summary: Get all orators
 *     tags: [Orators]
 *     responses:
 *       200:
 *         description: Successful retrieval
 */
router.get("/orators", orators_controller_1.OratorsController.getAll);
/**
 * @swagger
 * /orators/{id}:
 *   get:
 *     summary: Get an orator by ID
 *     tags: [Orators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the orator
 *     responses:
 *       200:
 *         description: Orator found
 *       404:
 *         description: Orator not found
 */
router.get("/orators/:id", orators_controller_1.OratorsController.getById);
/**
 * @swagger
 * /orators/{id}:
 *   put:
 *     summary: Update an orator
 *     tags: [Orators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the orator
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               picture:
 *                 type: string
 *                 nullable: true
 *               content_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       200:
 *         description: Orator updated successfully
 *       404:
 *         description: Orator not found
 */
router.put("/orators/:id", orators_controller_1.OratorsController.update);
/**
 * @swagger
 * /orators/{id}:
 *   delete:
 *     summary: Delete an orator
 *     tags: [Orators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the orator
 *     responses:
 *       204:
 *         description: Orator deleted successfully
 */
router.delete("/orators/:id", orators_controller_1.OratorsController.delete);
/**
 * @swagger
 * /orators/{oratorId}/content/{contentId}:
 *   post:
 *     summary: Add content to an orator
 *     tags: [Orators]
 *     parameters:
 *       - in: path
 *         name: oratorId
 *         required: true
 *         description: ID of the orator to which the content should be added
 *         schema:
 *           type: integer
 *       - in: path
 *         name: contentId
 *         required: true
 *         description: ID of the content to add to the orator
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Content added to the orator successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Content added to orator"
 *                 orator:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Angeard"
 *                     content_ids:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [1, 2, 3]
 *                     country:
 *                       type: string
 *                       example: "France"
 *                     city:
 *                       type: string
 *                       example: "Paris"
 *       400:
 *         description: Content already exists in the orator's list
 *       404:
 *         description: Orator or Content not found
 *       500:
 *         description: Server error
 */
router.post("/orators/:oratorId/content/:contentId", orators_controller_1.OratorsController.addContentToOrator);
/**
 * @swagger
 * /orators/{oratorId}/content/{contentId}:
 *   delete:
 *     summary: Remove content from an orator
 *     tags: [Orators]
 *     parameters:
 *       - in: path
 *         name: oratorId
 *         required: true
 *         description: ID of the orator from which the content should be removed
 *         schema:
 *           type: integer
 *       - in: path
 *         name: contentId
 *         required: true
 *         description: ID of the content to remove from the orator
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Content removed from the orator successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Content removed from orator"
 *                 orator:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Angeard"
 *                     content_ids:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [1, 2]
 *                     country:
 *                       type: string
 *                       example: "France"
 *                     city:
 *                       type: string
 *                       example: "Paris"
 *       400:
 *         description: Content not found in the orator's list
 *       404:
 *         description: Orator or Content not found
 *       500:
 *         description: Server error
 */
router.delete("/orators/:oratorId/content/:contentId", orators_controller_1.OratorsController.removeContentFromOrator);
/**
 * @swagger
 * /orators/{id}/photo:
 *   put:
 *     summary: Update orator's photo
 *     tags: [Orators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the orator
 *         schema:
 *           type: integer
 *       - in: body
 *         name: photoUrl
 *         description: URL of the photo to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             photoUrl:
 *               type: string
 *     responses:
 *       200:
 *         description: Orator's photo updated successfully
 *       404:
 *         description: Orator not found
 *       500:
 *         description: Server error
 */
router.put("/orators/:id/photo", orators_controller_1.OratorsController.updatePhoto);
exports.default = router;
