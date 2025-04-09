import { SessionRepository } from "../repository/session.repository";

export class SessionService {
  static async create(name: string) {
    return SessionRepository.create(name);
  }

  static async getAll() {
    return SessionRepository.findAll();
  }

  static async getById(id: number) {
    return SessionRepository.findById(id);
  }

  static async update(id: number, name: string) {
    return SessionRepository.update(id, name);
  }

  static async delete(id: number) {
    return SessionRepository.delete(id);
  }
}
