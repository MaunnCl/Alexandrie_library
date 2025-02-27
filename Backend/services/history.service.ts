import { HistoryRepository } from "../repository/history.repository";

export class HistoryService {
    static async addWatchHistory(data: any) {
        return HistoryRepository.create(data);
    }

    static async getAllWatchHistory() {
        return HistoryRepository.findAll();
    }

    static async getWatchHistoryByUser(userId: number) {
        return HistoryRepository.findByUserId(userId);
    }

    static async deleteWatchHistory(id: number) {
        return HistoryRepository.delete(id);
    }
}
