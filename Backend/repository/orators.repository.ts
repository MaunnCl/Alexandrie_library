import { db } from "../config/database";
import { oratorsTable } from "../schemas/orators";
import { eq } from "drizzle-orm";

export class OratorsRepository {
  static async findByName(name: string) {
    const result = await db
      .select()
      .from(oratorsTable)
      .where(eq(oratorsTable.name, name));
    return result[0];
  }

  static async findAll() {
    return db.select().from(oratorsTable);
  }

  static async findById(id: number) {
    const result = await db
      .select()
      .from(oratorsTable)
      .where(eq(oratorsTable.id, id));
    return result[0];
  }

  static async create(name: string, picture: string | null, content_ids: number[], country: string, city: string) {
    const result = await db
      .insert(oratorsTable)
      .values({ name, picture, content_ids, country, city })
      .returning();
    return result[0];
  }

  static async update(id: number, name: string, picture: string | null, content_ids: number[], country: string, city: string) {
    const result = await db
      .update(oratorsTable)
      .set({ name, picture, content_ids, country, city })
      .where(eq(oratorsTable.id, id))
      .returning();
    return result[0];
  }

  static async delete(id: number) {
    const result = await db
      .delete(oratorsTable)
      .where(eq(oratorsTable.id, id))
      .returning();
    return result[0];
  }
}
