import { db } from "../../config/database";
import { roleList } from "../schemas/role";
import { eq } from "drizzle-orm";

export class RoleRepository {
  static async create(data: any) {
    const result = await db.insert(roleList).values(data).returning();
    return result[0];
  }

  static findAll() {
    return db.select().from(roleList);
  }

  static async findById(id: string) {
    const result = await db.select().from(roleList).where(eq(roleList.id, id));
    return result[0];
  }

  static async update(id: string, data: any) {
    const result = await db.update(roleList).set(data).where(eq(roleList.id, id)).returning();
    return result[0];
  }

  static async delete(id: string) {
    const result = await db.delete(roleList).where(eq(roleList.id, id)).returning();
    return result[0];
  }
}
