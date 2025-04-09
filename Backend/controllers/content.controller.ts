import { Request, Response } from "express";
import { ContentService } from "../services/content.service";

export class ContentController {
  static async create(req: Request, res: Response) {
    const { title, description, url } = req.body;
    try {
      const content = await ContentService.create(title, description, url);
      res.status(201).json(content);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const contents = await ContentService.getAll();
      res.status(200).json(contents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const content = await ContentService.getById(Number(id));
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.status(200).json(content);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, url } = req.body;
    try {
      const updatedContent = await ContentService.update(Number(id), title, description, url);
      res.status(200).json(updatedContent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await ContentService.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}