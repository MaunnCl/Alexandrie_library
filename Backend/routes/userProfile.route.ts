import express from "express";
import { UserProfileController } from "../controllers/userProfile.controller";

const router = express.Router();

router.post("/", UserProfileController.createUserProfile);
router.get("/", UserProfileController.getAllUserProfiles);
router.get("/:id", UserProfileController.getUserProfileById);
router.put("/:id", UserProfileController.updateUserProfile);
router.delete("/:id", UserProfileController.deleteUserProfile);

export default router;
