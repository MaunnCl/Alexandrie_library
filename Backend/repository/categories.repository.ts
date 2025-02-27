import { db } from "../config/database";
import { categoriesTable } from "../schemas/categories";
import { contentCategoryTable } from "../schemas/categories";
import { eq } from "drizzle-orm";

export class CategoriesRepository {
    static async create(data: any) {
        return db.insert(categoriesTable).values(data).returning();
    }

    static async findAll() {
        return db.select().from(categoriesTable);
    }

    static async findById(id: number) {
        return db.select().from(categoriesTable).where(eq(categoriesTable.id, id));
    }

    static async delete(id: number) {
        return db.delete(categoriesTable).where(eq(categoriesTable.id, id)).returning();
    }
}

export class ContentCategoryRepository {
    static async associateContentToCategory(contentId: number, categoryId: number) {
        return db.insert(contentCategoryTable).values({ content_id: contentId, category_id: categoryId }).returning();
    }

    static async findCategoriesByContent(contentId: number) {
        return db.select().from(contentCategoryTable).where(eq(contentCategoryTable.content_id, contentId));
    }

    static async deleteAssociation(contentId: number, categoryId: number) {
        return db.delete(contentCategoryTable)
            .where(eq(contentCategoryTable.content_id, contentId))
            .where(eq(contentCategoryTable.category_id, categoryId))
            .returning();
    }
}