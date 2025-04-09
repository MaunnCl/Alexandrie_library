import { OratorsRepository } from "../repository/orators.repository";

export class OratorsService {
  static async create(name: string, picture: string | null, content_ids: number[], country: string, city: string) {
    const existingOrator = await OratorsRepository.findByName(name);
    if (existingOrator) {
      throw new Error("Orator with this name already exists");
    }

    return OratorsRepository.create(name, picture, content_ids, country, city);
  }

  static async getAll() {
    return OratorsRepository.findAll();
  }

  static async getById(id: number) {
    return OratorsRepository.findById(id);
  }

  static async update(id: number, name: string, picture: string | null, content_ids: number[], country: string, city: string) {
    return OratorsRepository.update(id, name, picture, content_ids, country, city);
  }

  static async delete(id: number) {
    return OratorsRepository.delete(id);
  }

  static async addContentToOrator(oratorId: number, contentId: number) {
    const orator = await OratorsRepository.findById(oratorId);
    if (!orator) throw new Error("Orator not found");
  
    if (!orator.content_ids.includes(contentId)) {
      orator.content_ids.push(contentId);
      return OratorsRepository.update(oratorId, orator.name, orator.picture, orator.content_ids, orator.country, orator.city);
    }
  
    throw new Error("Content already exists in the orator's list");
  }
  
  static async removeContentFromOrator(oratorId: number, contentId: number) {
    const orator = await OratorsRepository.findById(oratorId);
    if (!orator) throw new Error("Orator not found");
  
    const index = orator.content_ids.indexOf(contentId);
    if (index > -1) {
      orator.content_ids.splice(index, 1);
      return OratorsRepository.update(oratorId, orator.name, orator.picture, orator.content_ids, orator.country, orator.city);
    }
  
    throw new Error("Content not found in the orator's list");
  }
  
}
