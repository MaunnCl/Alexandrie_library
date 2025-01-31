import express from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/users", UserController.createUser);
router.get("/users", authenticateJWT, UserController.getAllUsers); // Protégé
router.get("/users/:id", authenticateJWT, UserController.getUserById); // Protégé
router.put("/users/:id", authenticateJWT, UserController.updateUser); // Protégé
router.delete("/users/:id", authenticateJWT, UserController.deleteUser); // Protégé

export default router;
