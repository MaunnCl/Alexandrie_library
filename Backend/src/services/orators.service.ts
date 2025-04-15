import { OratorsRepository } from "../repository/orators.repository";

export class OratorsService {
  static create(data: any) {
    return OratorsRepository.create(data);
  }

  static getAll() {
    return OratorsRepository.findAll();
  }

  static getById(id: number) {
    return OratorsRepository.findById(id);
  }

  static update(id: number, data: any) {
    return OratorsRepository.update(id, data);
  }

  static delete(id: number) {
    return OratorsRepository.delete(id);
  }

  static async updatePhoto(id: number, photoUrl: string) {
    return OratorsRepository.update(id, { picture: photoUrl });
  }

  static async addContentToOrator(oratorId: number, contentId: number) {
    const orator = await OratorsRepository.findById(oratorId);
    if (!orator) throw new Error("Orator not found");
  
    const updatedList = Array.isArray(orator.content_ids) ? [...orator.content_ids] : [];
    if (!updatedList.includes(contentId)) updatedList.push(contentId);
  
    return OratorsRepository.update(oratorId, { content_ids: updatedList });
  }

  static async removeContentFromOrator(oratorId: number, contentId: number) {
    const orator = await OratorsRepository.findById(oratorId);
    if (!orator) throw new Error("Orator not found");
  
    const updatedList = Array.isArray(orator.content_ids)
      ? orator.content_ids.filter(id => id !== contentId)
      : [];
  
    return OratorsRepository.update(oratorId, { content_ids: updatedList });
  }
}