"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryRepository = void 0;
const database_1 = require("../../config/database");
const history_1 = require("../schemas/history");
const drizzle_orm_1 = require("drizzle-orm");
class HistoryRepository {
    static addUserHistory(userId, contentId, timeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.db.insert(history_1.userHistory).values({ userId, contentId, timeStamp });
        });
    }
    static getUserHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.db
                .select()
                .from(history_1.userHistory)
                .where((0, drizzle_orm_1.eq)(history_1.userHistory.userId, userId))
                .orderBy(history_1.userHistory.viewedAt);
        });
    }
    static deleteUserHistory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.db.delete(history_1.userHistory).where((0, drizzle_orm_1.eq)(history_1.userHistory.id, id));
        });
    }
}
exports.HistoryRepository = HistoryRepository;
