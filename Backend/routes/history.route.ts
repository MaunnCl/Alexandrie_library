import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";

const router = Router();

/**
 *  @swagger
 *  /history:
 *  post:
 *      summary: Create a new history record
 *      tags: [History]
 *      description: Add a new history record for content viewing
 *      responses:
 *        201:
 *          description: History record created successfully
 *        400:
 *          description: Bad request
*/
router.post("/history", HistoryController.create);

/**
 *  @swagger
 *  /history:
 *  get:
 *      summary: Get all history records
 *      tags: [History]
 *      description: Retrieve a list of all content viewing history records
 *      responses:
 *        200:
 *          description: Successful retrieval
*/
router.get("/history", HistoryController.getAll);

/**
 *  @swagger
 *  /history/{userId}:
 *  get:
 *      summary: Get history records for a user
 *      tags: [History]
 *      description: Retrieve a specific user's content viewing history
 *      parameters:
 *        - in: path
 *          name: userId
 *          required: true
 *          description: ID of the user
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Successful retrieval
 *        404:
 *          description: User not found
*/
router.get("/history/:userId", HistoryController.getByUser);

/**
 *  @swagger
 *  /history/{id}:
 *  delete:
 *      summary: Delete a history record
 *      tags: [History]
 *      description: Remove a content viewing history record
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the history record to delete
 *          schema:
 *            type: integer
 *      responses:
 *        204:
 *          description: Successfully deleted
 *        404:
 *          description: History record not found
*/
router.delete("/history/:id", HistoryController.delete);

export default router;
