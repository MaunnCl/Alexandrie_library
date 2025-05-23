import { Request, Response } from "express";
import { RoleService } from "../services/role.service";

export class RoleController {
  static async create(req: Request, res: Response): Promise<void>  {
    try {
      console.log("📥 Incoming role data:", req.body);
      const role = await RoleService.create(req.body);
      res.status(201).json(role);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void>  {
    try {
      const roles = await RoleService.getAll();
      res.status(200).json(roles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void>  {
    try {
      const role = await RoleService.getById(req.params.id);
      if (!role) {
        res.status(404).json({ message: "Role not found" });
      }
      res.status(200).json(role);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void>  {
    try {
      const updated = await RoleService.update(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void>  {
    try {
      await RoleService.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
