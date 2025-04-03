import { Request, Response } from "express";
import { ContentService } from "../services/content.service";

export class ContentController {
  static async create(req: Request, res: Response) {
    try {
        const { title } = req.body;

        if (!title) {
          return res.status(400).json({ message: "Missing required title" });
        }
        

      const content = await ContentService.createContent({
        title
      });

      res.status(201).json(content);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const contents = await ContentService.getAllContents();
      res.status(200).json(contents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const content = await ContentService.getContentById(Number(req.params.id));
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.status(200).json(content);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedContent = await ContentService.updateContent(Number(req.params.id), req.body);
      res.status(200).json(updatedContent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await ContentService.deleteContent(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getContentByTitle(req: Request, res: Response) {
    try {
        const title = req.params.title;
        const content = await ContentService.getContentByTitle(title);
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
}
