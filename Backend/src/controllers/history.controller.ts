import { Request, Response } from "express";
import { HistoryService }from "../services/history.service";

export class historyController {
    static async addToHistory(req: Request, res: Response): Promise<void>  {
      const { userId, contentId, timeStamp } = req.body;
      if (!userId || !contentId || !timeStamp) {
        res.status(400).json({ error: "userId and contentId are required" });
      }
    
      try {
        const result = await HistoryService.addToHistory(userId, contentId, timeStamp);
        res.status(201).json(result);
      } catch (err) {
        res.status(500).json({ error: "Failed to add to history" });
      }
    };
    
    static async getUserHistory (req: Request, res: Response): Promise<void> {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId))
        res.status(400).json({ error: "Invalid userId" });
    
      try {
        const history = await HistoryService.getHistoryByUser(userId);
        res.json(history);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch history" });
      }
    };
    
    static async deleteHistoryItem(req: Request, res: Response): Promise<void> {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        res.status(400).json({ error: "Invalid id" });
    
      try {
        await HistoryService.removeHistoryItem(id);
        res.status(204).send();
      } catch (err) {
        res.status(500).json({ error: "Failed to delete history item" });
      }
}
};
