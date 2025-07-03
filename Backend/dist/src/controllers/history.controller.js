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
exports.historyController = void 0;
const history_service_1 = require("../services/history.service");
class historyController {
    static addToHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, contentId, timeStamp } = req.body;
            if (!userId || !contentId || !timeStamp) {
                res.status(400).json({ error: "userId and contentId are required" });
            }
            try {
                const result = yield history_service_1.HistoryService.addToHistory(userId, contentId, timeStamp);
                res.status(201).json(result);
            }
            catch (err) {
                res.status(500).json({ error: "Failed to add to history" });
            }
        });
    }
    ;
    static getUserHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.userId);
            if (isNaN(userId))
                res.status(400).json({ error: "Invalid userId" });
            try {
                const history = yield history_service_1.HistoryService.getHistoryByUser(userId);
                res.json(history);
            }
            catch (err) {
                res.status(500).json({ error: "Failed to fetch history" });
            }
        });
    }
    ;
    static deleteHistoryItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                res.status(400).json({ error: "Invalid id" });
            try {
                yield history_service_1.HistoryService.removeHistoryItem(id);
                res.status(204).send();
            }
            catch (err) {
                res.status(500).json({ error: "Failed to delete history item" });
            }
        });
    }
}
exports.historyController = historyController;
;
