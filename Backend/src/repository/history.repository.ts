import { db } from "../../config/database";
import { userHistory } from "../schemas/history";
import { eq } from "drizzle-orm";

export class HistoryRepository {
    static async addUserHistory(userId: number, contentId: number, timeStamp: string) {
      return db.insert(userHistory).values({ userId, contentId, timeStamp });
    }
    
    static async getUserHistory(userId: number) {
      return db
        .select()
        .from(userHistory)
        .where(eq(userHistory.userId, userId))
        .orderBy(userHistory.viewedAt);
    }

    static async deleteUserHistory(id: number) {
      return db.delete(userHistory).where(eq(userHistory.id, id));
    }
}
