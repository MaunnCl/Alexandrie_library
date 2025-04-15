import { Request, Response } from "express";
import { SessionService } from "../services/session.service";

export class SessionController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, content_ids } = req.body;
      const session = await SessionService.create(name, content_ids);
      res.status(201).json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const sessions = await SessionService.getAll();
      res.status(200).json(sessions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const session = await SessionService.getById(Number(req.params.id));
      if (!session) {
        res.status(404).json({ message: "Session not found" });
        return;
      }
      res.status(200).json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, content_ids } = req.body;
      const updated = await SessionService.update(
        Number(req.params.id),
        name,
        content_ids
      );
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      await SessionService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addContentToSession(req: Request, res: Response): Promise<void>  {
    try {
      const sessionId = Number(req.params.id);
      const contentId = Number(req.params.contentId);
  
      const updatedSession = await SessionService.addContentToSession(sessionId, contentId);
      res.status(200).json(updatedSession);
    } catch (err) {
      res.status(404).json({ message: "Session not found" });
    }
  }

  static async removeContentFromSession(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = Number(req.params.id);
      const contentId = Number(req.params.contentId);
      const updated = await SessionService.removeContentFromSession(sessionId, contentId);
      res.status(200).json(updated);
    } catch (error: any) {
      console.error("Error in removeContentFromSession:", error);
      res.status(500).json({ error: error.message });
    }
  }
}