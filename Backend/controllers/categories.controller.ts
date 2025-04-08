import { Request, Response } from "express";
import { CategoriesService, ContentCategoryService } from "../services/categories.service";

export class CategoriesController {
    static async create(req: Request, res: Response) {
        try {
            const category = await CategoriesService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const categories = await CategoriesService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const category = await CategoriesService.getCategoryById(Number(req.params.id));
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            await CategoriesService.deleteCategory(Number(req.params.id));
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async syncContentCategories(req: Request, res: Response) {
        try {
          const result = await CategoriesService.syncContentCategories();
          return res.status(200).json(result);
        } catch (error) {
          console.error("Erreur syncContentCategories :", error);
          return res.status(500).json({ error: error.message });
        }
    }  

    static async refreshOratorImage(req: Request, res: Response) {
        const categoryId = Number(req.params.id);
        if (isNaN(categoryId)) return res.status(400).json({ error: "Invalid category ID" });
      
        try {
          const updated = await CategoriesService.refreshCategoryOratorImage(categoryId);
          res.status(200).json(updated);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
    
    static async refreshAllOratorImages(req: Request, res: Response) {
        try {
          const result = await CategoriesService.refreshAllOratorImages();
          res.status(200).json({ success: true, updated: result });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    }
      
}

export class ContentCategoryController {
    static async associate(req: Request, res: Response) {
        try {
            const { content_id, category_id } = req.body;
            const association = await ContentCategoryService.associateContent(content_id, category_id);
            res.status(201).json(association);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getByCategory(req: Request, res: Response) {
        const categoryId = Number(req.params.categoryId);
      
        if (isNaN(categoryId)) {
          return res.status(400).json({ error: "Invalid category ID" });
        }
      
        try {
          const contents = await ContentCategoryService.getContentsByCategory(categoryId);
          res.status(200).json(contents);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }

    static async remove(req: Request, res: Response) {
        try {
            const { content_id, category_id } = req.body;
            await ContentCategoryService.removeAssociation(content_id, category_id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
