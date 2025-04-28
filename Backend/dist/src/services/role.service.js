"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const role_repository_1 = require("../repository/role.repository");
class RoleService {
    static create(data) {
        return role_repository_1.RoleRepository.create(data);
    }
    static getAll() {
        return role_repository_1.RoleRepository.findAll();
    }
    static getById(id) {
        return role_repository_1.RoleRepository.findById(id);
    }
    static update(id, data) {
        return role_repository_1.RoleRepository.update(id, data);
    }
    static delete(id) {
        return role_repository_1.RoleRepository.delete(id);
    }
}
exports.RoleService = RoleService;
