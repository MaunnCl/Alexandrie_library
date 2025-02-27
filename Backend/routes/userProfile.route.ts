import express from "express";
import { UserProfileController } from "../controllers/userProfile.controller";

const router = express.Router();

router.post("/profiles", UserProfileController.createUserProfile);
router.get("/profiles", UserProfileController.getAllUserProfiles);
router.get("/profiles/:id", UserProfileController.getUserProfileById);
router.put("/profiles/:id", UserProfileController.updateUserProfile);
router.delete("/profiles/:id", UserProfileController.deleteUserProfile);

export default router;
