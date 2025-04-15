import { Request, Response } from "express";
import { CongressService } from "../services/congress.service";

export class CongressController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, key, session_ids, picture, date, city } = req.body;
      const congress = await CongressService.create(name, key, session_ids, picture, date, city);
      res.status(201).json(congress);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const congressList = await CongressService.getAll();
      res.status(200).json(congressList);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const congress = await CongressService.getById(Number(req.params.id));
      if (!congress) {
        res.status(404).json({ message: "Congress not found" });
        return;
      }
      res.status(200).json(congress);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, key, session_ids, picture, date, city } = req.body;
      const updated = await CongressService.update(
        Number(req.params.id),
        name,
        key,
        session_ids,
        picture,
        date,
        city
      );
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      await CongressService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addSessionToCongress(req: Request, res: Response): Promise<void> {
    try {
      const result = await CongressService.addSessionToCongress(
        Number(req.params.congressId),
        Number(req.params.sessionId)
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async removeSessionFromCongress(req: Request, res: Response): Promise<void> {
    try {
      const result = await CongressService.removeSessionFromCongress(
        Number(req.params.congressId),
        Number(req.params.sessionId)
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
