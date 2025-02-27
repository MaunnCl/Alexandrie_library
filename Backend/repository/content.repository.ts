import { db } from "../config/database";
import { contentTable } from "../schemas/content";
import { eq } from "drizzle-orm";

export class ContentRepository {
    static async create(contentData: any) {
        return db.insert(contentTable).values(contentData).returning();
    }

    static async findAll() {
        return db.select().from(contentTable);
    }

    static async findById(id: number) {
        return db.select().from(contentTable).where(eq(contentTable.id, id));
    }

    static async update(id: number, updateData: any) {
        return db.update(contentTable)
            .set(updateData)
            .where(eq(contentTable.id, id))
            .returning();
    }

    static async delete(id: number) {
        return db.delete(contentTable).where(eq(contentTable.id, id)).returning();
    }
}
