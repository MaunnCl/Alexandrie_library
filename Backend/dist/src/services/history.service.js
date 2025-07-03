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
exports.HistoryService = void 0;
const history_repository_1 = require("../repository/history.repository");
class HistoryService {
    static addToHistory(userId, contentId, timeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            return history_repository_1.HistoryRepository.addUserHistory(userId, contentId, timeStamp);
        });
    }
    static getHistoryByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return history_repository_1.HistoryRepository.getUserHistory(userId);
        });
    }
    static removeHistoryItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return history_repository_1.HistoryRepository.deleteUserHistory(id);
        });
    }
}
exports.HistoryService = HistoryService;
