import { Router } from "express";
import { CategoriesController, ContentCategoryController } from "../controllers/categories.controller";

const router = Router();

/**
 * @swagger
 *   /categories:
 *   post:
 *       summary: Create a new category
 *       description: Add a new category to the system
 *       tags: [Categories]
 *   responses:
 *     201:
 *       description: Category created successfully
 *     400:
 *       description: Bad request
*/
router.post("/categories", CategoriesController.create);

/**
 *  @swagger
 *  /categories:
 *  get:
 *      summary: Get all categories
 *      tags: [Categories]
 *      description: Retrieve a list of all categories
 *      responses:
 *        200:
 *          description: Successful retrieval
*/
router.get("/categories", CategoriesController.getAll);

/**
 *  @swagger
 *  /categories/{id}:
 *  get:
 *      summary: Get category by ID
 *      tags: [Categories]
 *      description: Retrieve a specific category
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the category
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Successful retrieval
 *        404:
 *          description: Category not found
*/ 
router.get("/categories/:id", CategoriesController.getById);

/**
 *  @swagger
 *  /categories/{id}:
 *  delete:
 *      summary: Delete a category
 *      tags: [Categories]
 *      description: Remove a category from the system
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the category to delete
 *          schema:
 *            type: integer
 *      responses:
 *        204:
 *          description: Successfully deleted
 *        404:
 *          description: Category not found
*/
router.delete("/categories/:id", CategoriesController.delete);

/**
 *  @swagger
 *  /content-category:
 *  post:
 *      summary: Associate content with a category
 *      tags: [Content-Category]
 *      description: Link a content entry to a category
 *      responses:
 *       201:
 *          description: Association created successfully
 *       400:
 *          description: Bad request
*/
router.post("/content-category", ContentCategoryController.associate);

/**
 *  @swagger
 *  /content-category/{categoryId}:
 *    get:
 *      summary: Get contents for a category
 *      tags: [Content-Category]
 *      description: Retrieve all content linked to a specific category
 *      parameters:
 *        - in: path
 *          name: categoryId
 *          required: true
 *          description: ID of the category
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Successful retrieval
 *        404:
 *          description: Category not found
 */

router.get("/content-category/:categoryId", ContentCategoryController.getByCategory);

/**
 *  @swagger
 *  /content-category:
 *  delete:
 *      summary: Remove a content-category association
 *      tags: [Content-Category]
 *      description: Delete an association between a content entry and a category
 *      responses:
 *        204:
 *          description: Successfully deleted
 *        400:
 *          description: Bad request
*/
router.delete("/content-category", ContentCategoryController.remove);

/**
 *  @swagger
 *  /categories/sync:
 *    post:
 *      summary: Synchronise les vidéos avec les catégories
 *      tags: [Categories]
 *      description: Crée les catégories manquantes à partir du folder des contenus et les lie si besoin
 *      responses:
 *        200:
 *          description: Synchronisation réussie
 */
router.post("/categories/sync", CategoriesController.syncContentCategories);

/**
 * @swagger
 * /categories/{id}/refresh:
 *   patch:
 *     summary: Refresh signed URL of orator image for a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: URL refreshed successfully
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Server error
 */
router.patch("/categories/:id/refresh", CategoriesController.refreshOratorImage);

/**
 * @swagger
 * /categories/refresh:
 *   patch:
 *     summary: Refresh signed orator image URLs for all categories
 *     tags: [Categories]
 *     description: Regenerates signed URLs of orator images for all categories using linked content
 *     responses:
 *       200:
 *         description: All categories updated successfully
 *       500:
 *         description: Server error
 */
router.patch("/categories/refresh", CategoriesController.refreshAllOratorImages);

export default router;
