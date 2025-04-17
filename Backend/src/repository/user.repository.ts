import { db } from "../../config/database";
import { users } from "../schemas/user";
import { eq } from "drizzle-orm";

export class UsersRepository {
  static async create(data: any) {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  }

  static findAll() {
    return db.select().from(users);
  }

  static async findById(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  static async update(id: number, data: any) {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  }

  static async delete(id: number) {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result[0];
  }

  static async findByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }
}