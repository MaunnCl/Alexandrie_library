import { UsersRepository } from "../repository/user.repository";

export class UsersService {
  static create(data: any) {
    return UsersRepository.create(data);
  }

  static getAll() {
    return UsersRepository.findAll();
  }

  static getById(id: number) {
    return UsersRepository.findById(id);
  }

  static update(id: number, data: any) {
    return UsersRepository.update(id, data);
  }

  static delete(id: number) {
    return UsersRepository.delete(id);
  }

  static async findByEmail(email: string) {
    return await UsersRepository.findByEmail(email);
  }
}