import { Request, Response } from "express";
import { UsersRolesService } from "../services/usersRoles.service";
import { promises } from "dns";

export class UsersRolesController {
  static async create(req: Request, res: Response): Promise<void>  {
    try {
      const userRole = await UsersRolesService.create(req.body);
      res.status(201).json(userRole);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void>  {
    try {
      const userRoles = await UsersRolesService.getAll();
      res.status(200).json(userRoles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const userRole = await UsersRolesService.getById(req.params.id);
      if (!userRole) {
        res.status(404).json({ message: "UserRole not found" });
      }
      res.status(200).json(userRole);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void>  {
    try {
      const updated = await UsersRolesService.update(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void>  {
    try {
      await UsersRolesService.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
