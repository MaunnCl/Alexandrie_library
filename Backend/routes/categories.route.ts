import { Router } from "express";
import { CategoriesController, ContentCategoryController } from "../controllers/categories.controller";

const router = Router();

router.post("/categories", CategoriesController.create);
router.get("/categories", CategoriesController.getAll);
router.get("/categories/:id", CategoriesController.getById);
router.delete("/categories/:id", CategoriesController.delete);

router.post("/content-category", ContentCategoryController.associate);
router.get("/content-category/:contentId", ContentCategoryController.getByContent);
router.delete("/content-category", ContentCategoryController.remove);

export default router;
