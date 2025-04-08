import { CategoriesRepository } from "../repository/categories.repository";
import { ContentCategoryRepository } from "../repository/categories.repository";
import { ContentService } from "../services/content.service";
import { getSignedFileUrl} from "../utils/aws.utils";

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

    static async refreshCategoryOratorImage(categoryId: number) {
        const category = await CategoriesRepository.findById(categoryId);
        if (!category) throw new Error("Category not found");
      
        let pictureOrator = category.picture_orator;
      
        if (!pictureOrator) {
          const exampleContent = await CategoriesRepository.getOneContentByCategory(categoryId);
          if (!exampleContent) throw new Error("No content associated with this category");
      
          if (!exampleContent.picture_orator || !exampleContent.folder) {
            throw new Error("Missing data in example content");
          }
      
          pictureOrator = exampleContent.picture_orator;
      
          await CategoriesRepository.update(categoryId, {
            picture_orator: pictureOrator
          });
        }
        const folderSource = await CategoriesRepository.getOneContentByCategory(categoryId);
        if (!folderSource || !folderSource.folder) throw new Error("Unable to determine folder");
      
        const imageKey = `${folderSource.folder}/${pictureOrator}`;
        const signedUrl = await getSignedFileUrl(process.env.BUCKET_NAME!, imageKey);
      
        return CategoriesRepository.update(categoryId, {
          orator_image_url: signedUrl,
        });
      }
    
      static async refreshAllOratorImages() {
        const categories = await CategoriesRepository.findAll();
        const updated = [];
      
        for (const category of categories) {
          try {
            const result = await this.refreshCategoryOratorImage(category.id);
            updated.push({ id: category.id, status: "updated", result });
          } catch (err) {
            updated.push({ id: category.id, status: "error", error: err.message });
          }
        }
      
        return updated;
      }
       
}