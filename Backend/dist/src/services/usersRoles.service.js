"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRolesService = void 0;
const usersRoles_repository_1 = require("../repository/usersRoles.repository");
class UsersRolesService {
    static create(data) {
        return usersRoles_repository_1.UsersRolesRepository.create(data);
    }
    static getAll() {
        return usersRoles_repository_1.UsersRolesRepository.findAll();
    }
    static getById(id) {
        return usersRoles_repository_1.UsersRolesRepository.findById(id);
    }
    static update(id, data) {
        return usersRoles_repository_1.UsersRolesRepository.update(id, data);
    }
    static delete(id) {
        return usersRoles_repository_1.UsersRolesRepository.delete(id);
    }
}
exports.UsersRolesService = UsersRolesService;
