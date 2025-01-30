import express from "express";
import { register, login, getUser, updateUser, deleteUser } from "../controllers/user";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
