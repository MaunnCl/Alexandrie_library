import express from "express";
import RoleController from "../controllers/role.controller";

const router = express.Router();

/**
 *  @swagger
 *  /roles:
 *  post:
 *      summary: Create a new role
 *      tags: [Roles]
 *      description: Add a new role to the system
 *      responses:
 *        201:
 *          description: Role created successfully
 *        400:
 *          description: Bad request
*/
router.post("/roles", RoleController.createRole);

/**
 *  @swagger
 *  /roles:
 *  get:
 *      summary: Get all roles
 *      tags: [Roles]
 *      description: Retrieve a list of all roles
 *      responses:
 *        200:
 *          description: Successful retrieval
*/
router.get("/roles", RoleController.getAllRoles);

/**
 *  @swagger
 *  /roles/{id}:
 *  get:
 *      summary: Get role by ID
 *      tags: [Roles]
 *      description: Retrieve a specific role
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the role
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Successful retrieval
 *        404:
 *          description: Role not found
*/
router.get("/roles/:id", RoleController.getRoleById);

/**
 *  @swagger
 *  /roles/{id}:
 *  put:
 *      summary: Update a role
 *      tags: [Roles]
 *      description: Modify an existing role
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the role to update
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Role updated successfully
 *        404:
 *          description: Role not found
*/
router.put("/roles/:id", RoleController.updateRole);

/**
 *  @swagger
 *  /roles/{id}:
 *  delete:
 *      summary: Delete a role
 *      tags: [Roles]
 *      description: Remove a role from the system
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the role to delete
 *          schema:
 *            type: integer
 *      responses:
 *        204:
 *          description: Successfully deleted
 *        404:
 *          description: Role not found
*/
router.delete("/roles/:id", RoleController.deleteRole);

export default router;
