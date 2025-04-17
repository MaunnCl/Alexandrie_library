import { UsersRolesRepository } from "../repository/usersRoles.repository";

export class UsersRolesService {
  static create(data: any) {
    return UsersRolesRepository.create(data);
  }

  static getAll() {
    return UsersRolesRepository.findAll();
  }

  static getById(id: string) {
    return UsersRolesRepository.findById(id);
  }

  static update(id: string, data: any) {
    return UsersRolesRepository.update(id, data);
  }

  static delete(id: string) {
    return UsersRolesRepository.delete(id);
  }
}
