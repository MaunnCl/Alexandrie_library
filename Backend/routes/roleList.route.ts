import express from "express";
import { RoleController } from "../controllers/role.controller";

const router = express.Router();

router.post("/", RoleController.createRole);
router.get("/", RoleController.getAllRoles);
router.get("/:id", RoleController.getRoleById);
router.put("/:id", RoleController.updateRole);
router.delete("/:id", RoleController.deleteRole);

export default router;
