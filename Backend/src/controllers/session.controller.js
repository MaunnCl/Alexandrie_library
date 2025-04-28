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
exports.SessionController = void 0;
const session_service_1 = require("../services/session.service");
class SessionController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, content_ids } = req.body;
                const session = yield session_service_1.SessionService.create(name, content_ids);
                res.status(201).json(session);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessions = yield session_service_1.SessionService.getAll();
                res.status(200).json(sessions);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield session_service_1.SessionService.getById(Number(req.params.id));
                if (!session) {
                    res.status(404).json({ message: "Session not found" });
                    return;
                }
                res.status(200).json(session);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, content_ids } = req.body;
                const updated = yield session_service_1.SessionService.update(Number(req.params.id), name, content_ids);
                res.status(200).json(updated);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield session_service_1.SessionService.delete(Number(req.params.id));
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static addContentToSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionId = Number(req.params.id);
                const contentId = Number(req.params.contentId);
                const updatedSession = yield session_service_1.SessionService.addContentToSession(sessionId, contentId);
                res.status(200).json(updatedSession);
            }
            catch (err) {
                res.status(404).json({ message: "Session not found" });
            }
        });
    }
    static removeContentFromSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionId = Number(req.params.id);
                const contentId = Number(req.params.contentId);
                const updated = yield session_service_1.SessionService.removeContentFromSession(sessionId, contentId);
                res.status(200).json(updated);
            }
            catch (error) {
                console.error("Error in removeContentFromSession:", error);
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.SessionController = SessionController;
