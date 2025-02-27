import { db } from "../config/database";
import { historyTable } from "../schemas/history";
import { eq } from "drizzle-orm";

export class HistoryRepository {
    static async create(data: any) {
        return db.insert(historyTable).values(data).returning();
    }

    static async findAll() {
        return db.select().from(historyTable);
    }

    static async findByUserId(userId: number) {
        return db.select()
            .from(historyTable)
            .where(eq(historyTable.user_id, userId));
    }

    static async findById(id: number) {
        return db.select()
            .from(historyTable)
            .where(eq(historyTable.id, id));
    }

    static async delete(id: number) {
        return db.delete(historyTable)
            .where(eq(historyTable.id, id))
            .returning();
    }
}
