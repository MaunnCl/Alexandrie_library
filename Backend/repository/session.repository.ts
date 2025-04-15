import { db } from "../config/database";
import { sessionTable } from "../schemas/session";
import { eq } from "drizzle-orm";

export class SessionRepository {
  static async findById(id: number) {
    const result = await db
      .select()
      .from(sessionTable)
      .where(eq(sessionTable.id, id));
    return result[0];
  }

  static async findAll() {
    return db.select().from(sessionTable);
  }

  static async create(name: string, content_ids: number[]) {
    const result = await db
      .insert(sessionTable)
      .values({ name, content_ids })
      .returning();
    return result[0];
  }

  static async update(id: number, name: string, content_ids: number[]) {
    const result = await db
      .update(sessionTable)
      .set({ name, content_ids })
      .where(eq(sessionTable.id, id))
      .returning();
    return result[0];
  }

  static async delete(id: number) {
    const result = await db
      .delete(sessionTable)
      .where(eq(sessionTable.id, id))
      .returning();
    return result[0];
  }
}
