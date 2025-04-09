import { Request, Response } from "express";
import { SessionService } from "../services/session.service";

export class SessionController {
  static async create(req: Request, res: Response) {
    const { name } = req.body;
    try {
      const session = await SessionService.create(name);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const sessions = await SessionService.getAll();
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const session = await SessionService.getById(Number(id));
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.status(200).json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const updatedSession = await SessionService.update(Number(id), name);
      res.status(200).json(updatedSession);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await SessionService.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
