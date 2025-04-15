import { Request, Response } from "express";
import { RoleService } from "../services/role.service";

class RoleController {
    static async createRole(req: Request, res: Response): Promise<void> {
        try {
            const role = await RoleService.createRole(req.body);
            res.status(201).json(role);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création du rôle", error });
        }
    }

    static async getAllRoles(req: Request, res: Response): Promise<void> {
        try {
            const roles = await RoleService.getAllRoles();
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des rôles", error });
        }
    }

    static async getRoleById(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: "ID du rôle manquant" });
            return;
        }
    
        try {
            const role = await RoleService.getRoleById(id);
            if (!role) {
                res.status(404).json({ message: "Rôle non trouvé" });
                return;
            }
            res.status(200).json(role);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération du rôle", error });
        }
    }

    static async updateRole(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const role = await RoleService.updateRole(id, req.body);
            res.status(200).json(role);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour du rôle", error });
        }
    }

    static async deleteRole(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            await RoleService.deleteRole(id);
            res.status(200).json({ message: "Rôle supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression du rôle", error });
        }
    }
}

export default RoleController;
export { RoleController };
