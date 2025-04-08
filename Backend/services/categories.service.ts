import { CategoriesRepository } from "../repository/categories.repository";
import { ContentCategoryRepository } from "../repository/categories.repository";
import { ContentService } from "../services/content.service";

export class ContentCategoryService {
    static async associateContent(contentId: number, categoryId: number) {
        return ContentCategoryRepository.associateContentToCategory(contentId, categoryId);
    }

    static async getContentsByCategory(categoryId: number) {
        return ContentCategoryRepository.findContentsByCategorie(categoryId);
    }

    static async removeAssociation(contentId: number, categoryId: number) {
        return ContentCategoryRepository.deleteAssociation(contentId, categoryId);
    }
}

export class CategoriesService {
    static async createCategory(data: { name: string; description: string }) {
        return CategoriesRepository.createCategory(data.name, data.description);
    }

    static async getAllCategories() {
        return CategoriesRepository.findAll();
    }

    static async getCategoryById(id: number) {
        return CategoriesRepository.findById(id);
    }

    static async deleteCategory(id: number) {
        return CategoriesRepository.delete(id);
    }

    static async findOrCreateCategoryFromFolder(folder: string) {
        let category = await CategoriesRepository.findCategoryByName(folder);

        if (!category) {
            category = await CategoriesRepository.createCategory(
                folder,
                `Auteur : ${folder}`
            );
        }

        return category;
    }

    static async syncContentCategories() {
        return CategoriesRepository.syncContentCategories();
    }
}