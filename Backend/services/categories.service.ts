import { CategoriesRepository } from "../repository/categories.repository";
import { ContentCategoryRepository } from "../repository/categories.repository";

export class ContentCategoryService {
    static async associateContent(contentId: number, categoryId: number) {
        return ContentCategoryRepository.associateContentToCategory(contentId, categoryId);
    }

    static async getCategoriesForContent(contentId: number) {
        return ContentCategoryRepository.findCategoriesByContent(contentId);
    }

    static async removeAssociation(contentId: number, categoryId: number) {
        return ContentCategoryRepository.deleteAssociation(contentId, categoryId);
    }
}

export class CategoriesService {
    static async createCategory(data: any) {
        return CategoriesRepository.create(data);
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
}
