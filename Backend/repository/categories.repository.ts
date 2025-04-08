import { db } from "../config/database";
import { categoriesTable, contentCategoryTable } from "../schemas/categories";
import { contentTable } from "../schemas/content";
import { eq, and, inArray } from "drizzle-orm";

export class CategoriesRepository {
  static async findCategoryByName(name: string) {
    const result = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.name, name));
    return result[0];
  }

  static async createCategory(name: string, description: string) {
    const result = await db
      .insert(categoriesTable)
      .values({ name, description })
      .returning();
    return result[0];
  }

  static async syncContentCategories() {
    const allContents = await db.select().from(contentTable);
    const alreadyLinked = await db.select().from(contentCategoryTable);

    for (const content of allContents) {
      if (!content.folder) continue;

      let category = await this.findCategoryByName(content.folder);
      if (!category) {
        category = await this.createCategory(content.folder, `Auteur : ${content.folder}`);
      }

      const isLinked = alreadyLinked.some(
        (link) => link.content_id === content.id && link.category_id === category.id
      );

      if (!isLinked) {
        await db.insert(contentCategoryTable).values({
          content_id: content.id,
          category_id: category.id,
        });
      }
    }

    return { success: true };
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

  static async update(id: number, data: Partial<typeof categoriesTable._.inferInsert>) {
    const result = await db
      .update(categoriesTable)
      .set(data)
      .where(eq(categoriesTable.id, id))
      .returning();
  
    return result[0];
  }
  
  static async getOneContentByCategory(categoryId: number) {
    const link = await db
      .select()
      .from(contentCategoryTable)
      .where(eq(contentCategoryTable.category_id, categoryId))
      .limit(1);
  
    if (link.length === 0) return null;
  
    return db
      .select()
      .from(contentTable)
      .where(eq(contentTable.id, link[0].content_id))
      .then(res => res[0]);
  }
}

export class ContentCategoryRepository {
    static async associateContentToCategory(contentId: number, categoryId: number) {
        return db.insert(contentCategoryTable).values({ content_id: contentId, category_id: categoryId }).returning();
    }

    static async findContentsByCategorie(categoryId: number) {
        return db.select().from(contentCategoryTable).where(eq(contentCategoryTable.category_id, categoryId));
    }

    static async deleteAssociation(contentId: number, categoryId: number) {
        return db.delete(contentCategoryTable)
            .where(and(
                eq(contentCategoryTable.content_id, contentId),
                eq(contentCategoryTable.category_id, categoryId)
            ))
            .returning();
    }
}
