import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
    static async createUser(req: Request, res: Response) {
        try {
            const user = await UserService.createUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création de l'utilisateur", error });
        }
    }

    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error });
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const user = await UserService.getUserById(Number(req.params.id));
            if (!user)  {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const user = await UserService.updateUser(Number(req.params.id), req.body);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            await UserService.deleteUser(Number(req.params.id));
            res.status(200).json({ message: "Utilisateur supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error });
        }
    }
}
