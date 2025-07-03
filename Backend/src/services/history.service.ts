import { HistoryRepository }from "../repository/history.repository";

export class HistoryService {
    static async addToHistory(userId: number, contentId: number, timeStamp: string) {
      return HistoryRepository.addUserHistory(userId, contentId, timeStamp);
    }
    
    static async getHistoryByUser(userId: number) {
      return HistoryRepository.getUserHistory(userId);
    }
    
    static async removeHistoryItem(id: number) {
      return HistoryRepository.deleteUserHistory(id);
    }
}
