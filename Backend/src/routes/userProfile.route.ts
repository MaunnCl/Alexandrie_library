import express from "express";
import { UserProfileController } from "../controllers/userProfile.controller";

const router = express.Router();

/**
 *  @swagger
 *  /profiles:
 *  post:
 *      summary: Create a new user profile
 *      tags: [User Profiles]
 *      description: Add a new user profile to the system
 *      responses:
 *        201:
 *          description: User profile created successfully
 *        400:
 *          description: Bad request
*/
router.post("/profiles", UserProfileController.createUserProfile);

/**
 *  @swagger
 *  /profiles:
 *  get:
 *      summary: Get all user profiles
 *      tags: [User Profiles]
 *      description: Retrieve a list of all user profiles
 *      responses:
 *        200:
 *          description: Successful retrieval
*/
router.get("/profiles", UserProfileController.getAllUserProfiles);

/**
 *  @swagger
 *  /profiles/{id}:
 *  get:
 *      summary: Get user profile by ID
 *      tags: [User Profiles]
 *      description: Retrieve a specific user profile
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the user profile
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Successful retrieval
 *        404:
 *          description: User profile not found
*/
router.get("/profiles/:id", UserProfileController.getUserProfileById);

/**
 *  @swagger
 *  /profiles/{id}:
 *  put:
 *      summary: Update a user profile
 *      tags: [User Profiles]
 *      description: Modify an existing user profile
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the user profile to update
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: User profile updated successfully
 *        404:
 *          description: User profile not found
*/
router.put("/profiles/:id", UserProfileController.updateUserProfile);

/**
 *  @swagger
 *  /profiles/{id}:
 *  delete:
 *      summary: Delete a user profile
 *      tags: [User Profiles]
 *      description: Remove a user profile from the system
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the user profile to delete
 *          schema:
 *            type: integer
 *      responses:
 *        204:
 *          description: Successfully deleted
 *        404:
 *          description: User profile not found
*/
router.delete("/profiles/:id", UserProfileController.deleteUserProfile);

export default router;
