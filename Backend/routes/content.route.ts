import { Router } from "express";
import { ContentController } from "../controllers/content.controller";

const router = Router();

router.post("/", ContentController.create);
router.get("/", ContentController.getAll);
router.get("/:id", ContentController.getById);
router.put("/:id", ContentController.update);
router.delete("/:id", ContentController.delete);

export default router;
