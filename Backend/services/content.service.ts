import { ContentRepository } from "../repository/content.repository";

export class ContentService {
    static async createContent(data: any) {
        return ContentRepository.create(data);
    }

    static async getAllContents() {
        return ContentRepository.findAll();
    }

    static async getContentById(id: number) {
        return ContentRepository.findById(id);
    }

    static async updateContent(id: number, data: any) {
        return ContentRepository.update(id, data);
    }

    static async deleteContent(id: number) {
        return ContentRepository.delete(id);
    }
}
