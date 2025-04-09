import { db } from "../config/database";
import { contentTable } from "../schemas/content";
import { eq } from "drizzle-orm";

export class ContentRepository {
    static async findByTitle(title: string) {
      const result = await db
        .select()
        .from(contentTable)
        .where(eq(contentTable.title, title));
      return result[0];
    }
  
    static async findAll() {
      return db.select().from(contentTable);
    }
  
    static async findById(id: number) {
      const result = await db
        .select()
        .from(contentTable)
        .where(eq(contentTable.id, id));
      return result[0];
    }
  
    static async create(title: string, description: string | null, url: string | null) {
      const result = await db
        .insert(contentTable)
        .values({ title, description, url })
        .returning();
      return result[0];
    }
  
    static async update(id: number, title: string, description: string | null, url: string | null) {
      const result = await db
        .update(contentTable)
        .set({ title, description, url })
        .where(eq(contentTable.id, id))
        .returning();
      return result[0];
    }
  
    static async delete(id: number) {
      const result = await db
        .delete(contentTable)
        .where(eq(contentTable.id, id))
        .returning();
      return result[0];
    }
  }