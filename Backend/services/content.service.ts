import { ContentRepository } from "../repository/content.repository";

export class ContentService {
  static async create(title: string, description: string | null, url: string | null) {
    return ContentRepository.create(title, description, url);
  }

  static async getAll() {
    return ContentRepository.findAll();
  }

  static async getById(id: number) {
    return ContentRepository.findById(id);
  }

  static async update(id: number, title: string, description: string | null, url: string | null) {
    return ContentRepository.update(id, title, description, url);
  }

  static async delete(id: number) {
    return ContentRepository.delete(id);
  }
}