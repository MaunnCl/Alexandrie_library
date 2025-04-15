import { Request, Response } from "express";
import { OratorsService } from "../services/orators.service";

export class OratorsController {
  static async create(req: Request, res: Response): Promise<void> {
    const { name, picture, content_ids, country, city } = req.body;
    try {
      const orator = await OratorsService.create({ name, picture, content_ids, country, city });
      res.status(201).json(orator);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const orators = await OratorsService.getAll();
      res.status(200).json(orators);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const orator = await OratorsService.getById(Number(id));
      if (!orator) {
        res.status(404).json({ message: "Orator not found" });
        return;
      }
      res.status(200).json(orator);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, picture, content_ids, country, city } = req.body;

    try {
      const updatedOrator = await OratorsService.update(Number(id), { name, picture, content_ids, country, city });
      res.status(200).json(updatedOrator);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await OratorsService.delete(Number(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updatePhoto(req: Request, res: Response): Promise<void> {
    const { id, photoUrl } = req.body;
    try {
      const updated = await OratorsService.updatePhoto(Number(id), photoUrl);
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addContentToOrator(req: Request, res: Response): Promise<void> {
    try {
      const oratorId = Number(req.params.oratorId);
      const contentId = Number(req.params.contentId);
      const updated = await OratorsService.addContentToOrator(oratorId, contentId);
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeContentFromOrator(req: Request, res: Response): Promise<void> {
    try {
      const oratorId = Number(req.params.oratorId);
      const contentId = Number(req.params.contentId);
      const updated = await OratorsService.removeContentFromOrator(oratorId, contentId);
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}