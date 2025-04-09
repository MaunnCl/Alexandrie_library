import { Request, Response } from "express";
import { CongressService } from "../services/congress.service";
import { SessionService } from "@services/session.service";

export class CongressController {
  static async create(req: Request, res: Response) {
    const { name, session_ids, picture, date, city } = req.body;

    try {
      const congress = await CongressService.create(name, session_ids, picture, date, city);
      res.status(201).json(congress);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const congresses = await CongressService.getAll();
      res.status(200).json(congresses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const congress = await CongressService.getById(Number(id));
      if (!congress) {
        return res.status(404).json({ message: "Congress not found" });
      }
      res.status(200).json(congress);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, session_ids, picture, date, city } = req.body;

    try {
      const updatedCongress = await CongressService.update(Number(id), name, session_ids, picture, date, city);
      res.status(200).json(updatedCongress);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await CongressService.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addSessionToCongress(req: Request, res: Response) {
    const { congressId, sessionId } = req.params;
  
    try {
      const congress = await CongressService.getById(Number(congressId));
      if (!congress) {
        return res.status(404).json({ message: "Congress not found" });
      }
  
      const session = await SessionService.getById(Number(sessionId));
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
  
      if (!congress.session_ids.includes(Number(sessionId))) {
        congress.session_ids.push(Number(sessionId));
        await CongressService.update(congress.id, congress.name, congress.session_ids, congress.picture, congress.date, congress.city);
        res.status(200).json({ message: "Session added to congress", congress });
      } else {
        res.status(400).json({ message: "Session already exists in the congress" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeSessionFromCongress(req: Request, res: Response) {
    const { congressId, sessionId } = req.params;
  
    try {
      const congress = await CongressService.getById(Number(congressId));
      if (!congress) {
        return res.status(404).json({ message: "Congress not found" });
      }
  
      const session = await SessionService.getById(Number(sessionId));
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
  
      const index = congress.session_ids.indexOf(Number(sessionId));
      if (index > -1) {
        congress.session_ids.splice(index, 1); // Supprimer la session du tableau
        await CongressService.update(congress.id, congress.name, congress.session_ids, congress.picture, congress.date, congress.city);
        res.status(200).json({ message: "Session removed from congress", congress });
      } else {
        res.status(400).json({ message: "Session not found in the congress" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
}
