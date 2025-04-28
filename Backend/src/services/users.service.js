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
exports.UsersService = void 0;
const user_repository_1 = require("../repository/user.repository");
class UsersService {
    static create(data) {
        return user_repository_1.UsersRepository.create(data);
    }
    static getAll() {
        return user_repository_1.UsersRepository.findAll();
    }
    static getById(id) {
        return user_repository_1.UsersRepository.findById(id);
    }
    static update(id, data) {
        return user_repository_1.UsersRepository.update(id, data);
    }
    static delete(id) {
        return user_repository_1.UsersRepository.delete(id);
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_repository_1.UsersRepository.findByEmail(email);
        });
    }
}
exports.UsersService = UsersService;
