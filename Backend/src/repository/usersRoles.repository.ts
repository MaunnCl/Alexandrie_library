import { db } from "../../config/database";
import { usersRoles } from "../schemas/userRole";
import { eq } from "drizzle-orm";

export class UsersRolesRepository {
  static async create(data: any) {
    const result = await db.insert(usersRoles).values(data).returning();
    return result[0];
  }

  static findAll() {
    return db.select().from(usersRoles);
  }

  static async findById(id: string) {
    const result = await db.select().from(usersRoles).where(eq(usersRoles.id, id));
    return result[0];
  }

  static async update(id: string, data: any) {
    const result = await db.update(usersRoles).set(data).where(eq(usersRoles.id, id)).returning();
    return result[0];
  }

  static async delete(id: string) {
    const result = await db.delete(usersRoles).where(eq(usersRoles.id, id)).returning();
    return result[0];
  }
}
