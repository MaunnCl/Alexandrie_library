import express from "express";
import RoleController from "../controllers/role.controller";

const router = express.Router();

router.post("/roles", RoleController.createRole);
router.get("/roles", RoleController.getAllRoles);
router.get("/roles/:id", RoleController.getRoleById);
router.put("/roles/:id", RoleController.updateRole);
router.delete("/roles/:id", RoleController.deleteRole);

export default router;
