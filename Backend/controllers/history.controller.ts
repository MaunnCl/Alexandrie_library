import { Request, Response } from "express";
import { HistoryService } from "../services/history.service";

export class HistoryController {
    static async create(req: Request, res: Response) {
        try {
            const history = await HistoryService.addWatchHistory(req.body);
            res.status(201).json(history);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const history = await HistoryService.getAllWatchHistory();
            res.status(200).json(history);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getByUser(req: Request, res: Response) {
        try {
            const history = await HistoryService.getWatchHistoryByUser(Number(req.params.userId));
            res.status(200).json(history);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            await HistoryService.deleteWatchHistory(Number(req.params.id));
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
