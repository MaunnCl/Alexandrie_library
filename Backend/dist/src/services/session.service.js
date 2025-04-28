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
exports.SessionService = void 0;
const session_repository_1 = require("../repository/session.repository");
class SessionService {
    static create(name, content_ids) {
        return session_repository_1.SessionRepository.create(name, content_ids);
    }
    static getAll() {
        return session_repository_1.SessionRepository.findAll();
    }
    static getById(id) {
        return session_repository_1.SessionRepository.findById(id);
    }
    static update(id, name, content_ids) {
        return session_repository_1.SessionRepository.update(id, name, content_ids);
    }
    static delete(id) {
        return session_repository_1.SessionRepository.delete(id);
    }
    static addContentToSession(sessionId, contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield session_repository_1.SessionRepository.findById(sessionId);
            if (!session)
                throw new Error("Session not found");
            const updatedIds = [...(session.content_ids || []), contentId];
            return session_repository_1.SessionRepository.update(sessionId, session.name, updatedIds);
        });
    }
    static removeContentFromSession(sessionId, contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield session_repository_1.SessionRepository.findById(sessionId);
            if (!session)
                throw new Error("Session not found");
            const list = (session.content_ids || []).filter(id => id !== contentId);
            return session_repository_1.SessionRepository.update(sessionId, session.name, list);
        });
    }
}
exports.SessionService = SessionService;
