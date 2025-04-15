import { Request, Response } from "express";
import { ContentService } from "../services/content.service";

export class ContentController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, orator_id, description, url } = req.body;
      const content = await ContentService.create(title, Number(orator_id), description, url);
      res.status(201).json(content);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const contents = await ContentService.getAll();
      res.status(200).json(contents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const content = await ContentService.getById(Number(req.params.id));
      if (!content) {
        res.status(404).json({ message: "Content not found" });
        return;
      }
      res.status(200).json(content);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { title, orator_id, description, url } = req.body;
      const updated = await ContentService.update(
        Number(req.params.id),
        title,
        Number(orator_id),
        description,
        url
      );
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      await ContentService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addContentToOrator(req: Request, res: Response): Promise<void> {
    const { contentId, oratorId } = req.params;
    try {
      const updatedContent = await ContentService.addContentToOrator(Number(contentId), Number(oratorId));
      res.status(200).json(updatedContent);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeContentFromOrator(req: Request, res: Response): Promise<void> {
    const { contentId } = req.params;
    try {
      const updatedContent = await ContentService.removeContentFromOrator(Number(contentId));
      res.status(200).json(updatedContent);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}