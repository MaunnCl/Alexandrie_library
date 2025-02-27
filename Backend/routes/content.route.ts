import { Router } from "express";
import { ContentController } from "../controllers/content.controller";

const router = Router();

router.post("/contents", ContentController.create);
router.get("/contents", ContentController.getAll);
router.get("/contents/:id", ContentController.getById);
router.put("/contents/:id", ContentController.update);
router.delete("/contents/:id", ContentController.delete);

export default router;
