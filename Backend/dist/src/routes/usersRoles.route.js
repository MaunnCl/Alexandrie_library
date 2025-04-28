"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersRoles_controller_1 = require("../controllers/usersRoles.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: UsersRoles
 *   description: Manage users-role assignments
 */
/**
 * @swagger
 * /users-roles:
 *   post:
 *     summary: Assign a role to a user
 *     tags: [UsersRoles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roleId
 *             properties:
 *               userId:
 *                 type: integer
 *               roleId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Assignment created
 */
router.post("/users-roles", usersRoles_controller_1.UsersRolesController.create);
/**
 * @swagger
 * /users-roles:
 *   get:
 *     summary: Get all users-roles
 *     tags: [UsersRoles]
 *     responses:
 *       200:
 *         description: List of assignments
 */
router.get("/users-roles", usersRoles_controller_1.UsersRolesController.getAll);
/**
 * @swagger
 * /users-roles/{id}:
 *   get:
 *     summary: Get assignment by ID
 *     tags: [UsersRoles]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignment found
 *       404:
 *         description: Not found
 */
router.get("/users-roles/:id", usersRoles_controller_1.UsersRolesController.getById);
/**
 * @swagger
 * /users-roles/{id}:
 *   put:
 *     summary: Update an assignment
 *     tags: [UsersRoles]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               roleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Assignment updated
 */
router.put("/users-roles/:id", usersRoles_controller_1.UsersRolesController.update);
/**
 * @swagger
 * /users-roles/{id}:
 *   delete:
 *     summary: Delete an assignment
 *     tags: [UsersRoles]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Assignment deleted
 */
router.delete("/users-roles/:id", usersRoles_controller_1.UsersRolesController.delete);
exports.default = router;
