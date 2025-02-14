import { RoleRepository } from "../repository/role.repository";

export class RoleService {
    static async createRole(roleData: any) {
        return await RoleRepository.createRole(roleData);
    }

    static async getAllRoles() {
        return await RoleRepository.getAllRoles();
    }

    static async getRoleById(id: number) {
        return await RoleRepository.getRoleById(id);
    }

    static async updateRole(id: number, roleData: any) {
        return await RoleRepository.updateRole(id, roleData);
    }

    static async deleteRole(id: number) {
        return await RoleRepository.deleteRole(id);
    }
}
