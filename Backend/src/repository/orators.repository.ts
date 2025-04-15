import { db } from "../../config/database";
import { oratorsTable } from "../schemas/orators";
import { eq } from "drizzle-orm";

export class OratorsRepository {
  static async create(data: any) {
    const result = await db.insert(oratorsTable).values(data).returning();
    return result[0];
  }

  static findAll() {
    return db.select().from(oratorsTable);
  }

  static async findById(id: number) {
    const result = await db.select().from(oratorsTable).where(eq(oratorsTable.id, id));
    return result[0];
  }

  static async update(id: number, data: any) {
    const result = await db.update(oratorsTable).set(data).where(eq(oratorsTable.id, id)).returning();
    return result[0];
  }

  static async delete(id: number) {
    const result = await db.delete(oratorsTable).where(eq(oratorsTable.id, id)).returning();
    return result[0];
  }
}