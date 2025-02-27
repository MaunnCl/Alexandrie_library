import express from "express";
import { RoleController } from "../controllers/role.controller";

const router = express.Router();

router.post("/users-roles", RoleController.createRole);
router.get("/users-roles", RoleController.getAllRoles);
router.get("/users-roles/:id", RoleController.getRoleById);
router.delete("/users-roles/:id", RoleController.deleteRole);

export default router;
