import { RoleRepository } from "../repository/role.repository";

export class RoleService {
    static async createRole(roleData: any) {
        return await RoleRepository.createRole(roleData);
    }

    static async getAllRoles() {
        return await RoleRepository.getAllRoles();
    }

    static async getRoleById(id: string) {
        return await RoleRepository.getRoleById(id);
    }

    static async updateRole(id: string, roleData: any) {
        return await RoleRepository.updateRole(id, roleData);
    }

    static async deleteRole(id: string) {
        return await RoleRepository.deleteRole(id);
    }
}
