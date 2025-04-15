import { ContentRepository } from "../repository/content.repository";

export class ContentService {
  static async create(title: string, orator_id: number, description: string, url: string) {
    return ContentRepository.create(title, orator_id, description, url);
  }

  static async getAll() {
    return ContentRepository.findAll();
  }

  static async getById(id: number) {
    return ContentRepository.findById(id);
  }

  static async update(id: number, title: string, orator_id: number, description: string, url: string) {
    return ContentRepository.update(id, title, orator_id, description, url);
  }

  static async delete(id: number) {
    return ContentRepository.delete(id);
  }
}