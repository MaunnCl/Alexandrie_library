import { db } from "../../config/database";
import { usersProfiles } from "../schemas/profile";
import { eq } from "drizzle-orm";

export class UsersProfilesRepository {
  static async create(data: any) {
    const result = await db.insert(usersProfiles).values(data).returning();
    return result[0];
  }

  static findAll() {
    return db.select().from(usersProfiles);
  }

  static async findById(id: string) {
    const result = await db.select().from(usersProfiles).where(eq(usersProfiles.id, id));
    return result[0];
  }

  static async update(id: string, data: any) {
    const result = await db.update(usersProfiles).set(data).where(eq(usersProfiles.id, id)).returning();
    return result[0];
  }

  static async delete(id: string) {
    const result = await db.delete(usersProfiles).where(eq(usersProfiles.id, id)).returning();
    return result[0];
  }
}
