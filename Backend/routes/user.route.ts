import express from "express";
import { UserController } from "../controllers/user.controller";

const router = express.Router();

router.post("/users", UserController.createUser);
router.get("/users", UserController.getAllUsers);
router.get("/users/:id", UserController.getUserById);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

export default router;
