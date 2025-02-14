import { Request, Response } from "express";
import { UserProfileService } from "../services/userProfile.service";

export class UserProfileController {
    static async createUserProfile(req: Request, res: Response) {
        try {
            const profile = await UserProfileService.createUserProfile(req.body);
            res.status(201).json(profile);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création du profil", error });
        }
    }

    static async getAllUserProfiles(req: Request, res: Response) {
        try {
            const profiles = await UserProfileService.getAllUserProfiles();
            res.status(200).json(profiles);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des profils", error });
        }
    }

    static async getUserProfileById(req: Request, res: Response) {
        try {
            const profile = await UserProfileService.getUserProfileById(req.params.id);
            if (!profile) return res.status(404).json({ message: "Profil non trouvé" });
            res.status(200).json(profile);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération du profil", error });
        }
    }

    static async updateUserProfile(req: Request, res: Response) {
        try {
            const profile = await UserProfileService.updateUserProfile(req.params.id, req.body);
            res.status(200).json(profile);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error });
        }
    }

    static async deleteUserProfile(req: Request, res: Response) {
        try {
            await UserProfileService.deleteUserProfile(req.params.id);
            res.status(200).json({ message: "Profil supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression du profil", error });
        }
    }
}
