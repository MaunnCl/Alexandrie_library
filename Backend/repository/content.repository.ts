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
        const result = await db
            .select()
            .from(contentTable)
            .where(eq(contentTable.id, id));
        return result[0];
    }

    static async update(id: number, data: Partial<typeof contentTable._.inferInsert>) {
        return db.update(contentTable)
          .set(data)
          .where(eq(contentTable.id, id))
          .returning()
          .then(res => res[0]);
    }

    static async delete(id: number) {
        return db.delete(contentTable).where(eq(contentTable.id, id)).returning();
    }

    static async findByTitle(title: string) {
        return db.select().from(contentTable).where(eq(contentTable.title, title));
    }    
}
