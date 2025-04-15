import { db } from "../config/database";
import { congressTable } from "../schemas/congress";
import { eq } from "drizzle-orm";

export class CongressRepository {
  static async findById(id: number) {
    const result = await db
      .select()
      .from(congressTable)
      .where(eq(congressTable.id, id));
    return result[0];
  }

  static async findAll() {
    return db.select().from(congressTable);
  }

  static async create(name: string, key: string, session_ids: number[], picture: string | null, date: string, city: string) {
    const result = await db
      .insert(congressTable)
      .values({ name, key, session_ids, picture, date, city })
      .returning();
    return result[0];
  }

  static async update(id: number, name: string, key: string, session_ids: number[], picture: string | null, date: string, city: string) {
    const result = await db
      .update(congressTable)
      .set({ name, key, session_ids, picture, date, city })
      .where(eq(congressTable.id, id))
      .returning();
    return result[0];
  }

  static async delete(id: number) {
    const result = await db
      .delete(congressTable)
      .where(eq(congressTable.id, id))
      .returning();
    return result[0];
  }
}
