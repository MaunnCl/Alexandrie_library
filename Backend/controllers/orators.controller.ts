import { Request, Response } from "express";
import { OratorsService } from "../services/orators.service";

export class OratorsController {
  static async create(req: Request, res: Response) {
    const { name, picture, content_ids, country, city } = req.body;

    try {
      const orator = await OratorsService.create(name, picture, content_ids, country, city);
      res.status(201).json(orator);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const orators = await OratorsService.getAll();
      res.status(200).json(orators);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const orator = await OratorsService.getById(Number(id));
      if (!orator) {
        return res.status(404).json({ message: "Orator not found" });
      }
      res.status(200).json(orator);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, picture, content_ids, country, city } = req.body;

    try {
      const updatedOrator = await OratorsService.update(Number(id), name, picture, content_ids, country, city);
      res.status(200).json(updatedOrator);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await OratorsService.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addContentToOrator(req: Request, res: Response) {
    const { oratorId, contentId } = req.params;
  
    try {
      const orator = await OratorsService.getById(Number(oratorId));
      if (!orator) {
        return res.status(404).json({ message: "Orator not found" });
      }
  
      if (!orator.content_ids.includes(Number(contentId))) {
        orator.content_ids.push(Number(contentId));
        await OratorsService.update(orator.id, orator.name, orator.picture, orator.content_ids, orator.country, orator.city);
        res.status(200).json({ message: "Video added to orator", orator });
      } else {
        res.status(400).json({ message: "Content already exists in the orator's list" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
        }
    }

    static async removeContentFromOrator(req: Request, res: Response) {
        const { oratorId, contentId } = req.params;
      
        try {
          const orator = await OratorsService.getById(Number(oratorId));
          if (!orator) {
            return res.status(404).json({ message: "Orator not found" });
          }
      
          const index = orator.content_ids.indexOf(Number(contentId));
          if (index > -1) {
            orator.content_ids.splice(index, 1);  // Retirer le contentId du tableau
            await OratorsService.update(orator.id, orator.name, orator.picture, orator.content_ids, orator.country, orator.city);
            res.status(200).json({ message: "Video removed from orator", orator });
          } else {
            res.status(400).json({ message: "Content not found in the orator's list" });
          }
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
    
      static async updatePhoto(req: Request, res: Response) {
        const { id, photoUrl } = req.body;
        try {
          const updatedOrator = await OratorsService.updatePhoto(Number(id), photoUrl);
          res.status(200).json(updatedOrator);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
}
