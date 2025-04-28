"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRolesController = void 0;
const usersRoles_service_1 = require("../services/usersRoles.service");
class UsersRolesController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRole = yield usersRoles_service_1.UsersRolesService.create(req.body);
                res.status(201).json(userRole);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRoles = yield usersRoles_service_1.UsersRolesService.getAll();
                res.status(200).json(userRoles);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRole = yield usersRoles_service_1.UsersRolesService.getById(req.params.id);
                if (!userRole) {
                    res.status(404).json({ message: "UserRole not found" });
                }
                res.status(200).json(userRole);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield usersRoles_service_1.UsersRolesService.update(req.params.id, req.body);
                res.status(200).json(updated);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield usersRoles_service_1.UsersRolesService.delete(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.UsersRolesController = UsersRolesController;
