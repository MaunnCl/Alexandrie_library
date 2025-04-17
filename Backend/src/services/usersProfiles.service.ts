import { UsersProfilesRepository } from "../repository/usersProfiles.repository";

export class UsersProfilesService {
  static create(data: any) {
    return UsersProfilesRepository.create(data);
  }

  static getAll() {
    return UsersProfilesRepository.findAll();
  }

  static getById(id: string) {
    return UsersProfilesRepository.findById(id);
  }

  static update(id: string, data: any) {
    return UsersProfilesRepository.update(id, data);
  }

  static delete(id: string) {
    return UsersProfilesRepository.delete(id);
  }
}
