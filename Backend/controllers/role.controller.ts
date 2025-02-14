import { Request, Response } from "express";
import { RoleService } from "../services/role.service";

export class RoleController {
    static async createRole(req: Request, res: Response) {
        try {
            const role = await RoleService.createRole(req.body);
            res.status(201).json(role);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création du rôle", error });
        }
    }

    static async getAllRoles(req: Request, res: Response) {
        try {
            const roles = await RoleService.getAllRoles();
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des rôles", error });
        }
    }

    static async getRoleById(req: Request, res: Response) {
        try {
            const role = await RoleService.getRoleById(req.params.id);
            if (!role) return res.status(404).json({ message: "Rôle non trouvé" });
            res.status(200).json(role);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération du rôle", error });
        }
    }

    static async updateRole(req: Request, res: Response) {
        try {
            const role = await RoleService.updateRole(req.params.id, req.body);
            res.status(200).json(role);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour du rôle", error });
        }
    }

    static async deleteRole(req: Request, res: Response) {
        try {
            await RoleService.deleteRole(req.params.id);
            res.status(200).json({ message: "Rôle supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression du rôle", error });
        }
    }
}
