import { Request, Response } from "express";
import { UsersProfilesService } from "../services/usersProfiles.service";

export class UsersProfilesController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const profile = await UsersProfilesService.create(req.body);
      res.status(201).json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const profiles = await UsersProfilesService.getAll();
      res.status(200).json(profiles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const profile = await UsersProfilesService.getById(req.params.id);
      if (!profile) {
        res.status(404).json({ message: "Profile not found" });
        return;
      }
      res.status(200).json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const updatedProfile = await UsersProfilesService.update(req.params.id, req.body);
      res.status(200).json(updatedProfile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      await UsersProfilesService.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
