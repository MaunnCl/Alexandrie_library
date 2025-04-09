import { CongressRepository } from "../repository/congress.repository";

export class CongressService {
  static async create(name: string, session_ids: number[], picture: string | null, date: string, city: string) {
    return CongressRepository.create(name, session_ids, picture, date, city);
  }

  static async getAll() {
    return CongressRepository.findAll();
  }

  static async getById(id: number) {
    return CongressRepository.findById(id);
  }

  static async update(id: number, name: string, session_ids: number[], picture: string | null, date: string, city: string) {
    return CongressRepository.update(id, name, session_ids, picture, date, city);
  }

  static async delete(id: number) {
    return CongressRepository.delete(id);
  }
}
