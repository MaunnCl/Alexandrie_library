import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";

const router = Router();

router.post("/", HistoryController.create);
router.get("/", HistoryController.getAll);
router.get("/user/:userId", HistoryController.getByUser);
router.delete("/:id", HistoryController.delete);

export default router;
