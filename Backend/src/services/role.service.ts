import { RoleRepository } from "../repository/role.repository";

export class RoleService {
  static create(data: any) {
    return RoleRepository.create(data);
  }

  static getAll() {
    return RoleRepository.findAll();
  }

  static getById(id: string) {
    return RoleRepository.findById(id);
  }

  static update(id: string, data: any) {
    return RoleRepository.update(id, data);
  }

  static delete(id: string) {
    return RoleRepository.delete(id);
  }
}
