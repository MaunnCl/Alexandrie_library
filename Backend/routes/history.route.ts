import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";

const router = Router();

router.post("/contents", HistoryController.create);
router.get("/contents", HistoryController.getAll);
router.get("/contents/:userId", HistoryController.getByUser);
router.delete("/contents/:id", HistoryController.delete);

export default router;
