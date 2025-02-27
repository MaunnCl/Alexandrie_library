import express from "express";
import { RoleController } from "../controllers/role.controller";

const router = express.Router();

/**
 *  @swagger
 *  /users-roles:
 *  post:
 *      summary: Assign a role to a user
 *      tags: [User Roles]
 *      description: Assign a new role to a user in the system
 *      responses:
 *        201:
 *          description: Role assigned successfully
 *        400:
 *          description: Bad request
*/
router.post("/users-roles", RoleController.createRole);

/**
 *  @swagger
 *  /users-roles:
 *  get:
 *      summary: Get all user role
 *      tags: [User Roles]
 *      description: Retrieve a list of all user roles
 *      responses:
 *        200:
 *          description: Successful retrieval
*/
router.get("/users-roles", RoleController.getAllRoles);

/**
 *  @swagger
 *  /users-roles/{id}:
 *  get:
 *      summary: Get user role by ID
 *      tags: [User Roles]
 *      description: Retrieve a specific user role
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the user role
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Successful retrieval
 *        404:
 *          description: User role not found
*/
router.get("/users-roles/:id", RoleController.getRoleById);

/**
 *  @swagger
 *  /users-roles/{id}:
 *  delete:
 *      summary: Delete a user role
 *      tags: [User Roles]
 *      description: Remove a user role from the system
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the user role to delete
 *          schema:
 *            type: integer
 *      responses:
 *        204:
 *          description: Successfully deleted
 *        404:
 *          description: User role not found
*/
router.delete("/users-roles/:id", RoleController.deleteRole);

export default router;
