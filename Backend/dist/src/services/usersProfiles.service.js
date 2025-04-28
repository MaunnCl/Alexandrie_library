"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersProfilesService = void 0;
const usersProfiles_repository_1 = require("../repository/usersProfiles.repository");
class UsersProfilesService {
    static create(data) {
        return usersProfiles_repository_1.UsersProfilesRepository.create(data);
    }
    static getAll() {
        return usersProfiles_repository_1.UsersProfilesRepository.findAll();
    }
    static getById(id) {
        return usersProfiles_repository_1.UsersProfilesRepository.findById(id);
    }
    static update(id, data) {
        return usersProfiles_repository_1.UsersProfilesRepository.update(id, data);
    }
    static delete(id) {
        return usersProfiles_repository_1.UsersProfilesRepository.delete(id);
    }
}
exports.UsersProfilesService = UsersProfilesService;
