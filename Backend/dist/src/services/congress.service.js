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
exports.CongressService = void 0;
const congress_repository_1 = require("../repository/congress.repository");
class CongressService {
    static create(name_1, key_1) {
        return __awaiter(this, arguments, void 0, function* (name, key, session_ids = [], picture, date, city) {
            return congress_repository_1.CongressRepository.create(name, key, session_ids, picture, date, city);
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return congress_repository_1.CongressRepository.findAll();
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return congress_repository_1.CongressRepository.findById(id);
        });
    }
    static update(id_1, name_1, key_1) {
        return __awaiter(this, arguments, void 0, function* (id, name, key, session_ids = [], picture, date, city) {
            return congress_repository_1.CongressRepository.update(id, name, key, session_ids, picture, date, city);
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return congress_repository_1.CongressRepository.delete(id);
        });
    }
    static addSessionToCongress(congressId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const congress = yield congress_repository_1.CongressRepository.findById(congressId);
            if (!congress)
                throw new Error("Congress not found");
            const sessions = Array.isArray(congress.session_ids) ? [...congress.session_ids] : [];
            if (!sessions.includes(sessionId)) {
                sessions.push(sessionId);
                return congress_repository_1.CongressRepository.update(congress.id, congress.name, congress.key, sessions, congress.picture, congress.date, congress.city);
            }
            throw new Error("Session already added to this congress");
        });
    }
    static removeSessionFromCongress(congressId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const congress = yield congress_repository_1.CongressRepository.findById(congressId);
            if (!congress)
                throw new Error("Congress not found");
            const sessions = Array.isArray(congress.session_ids) ? congress.session_ids.filter(id => id !== sessionId) : [];
            return congress_repository_1.CongressRepository.update(congress.id, congress.name, congress.key, sessions, congress.picture, congress.date, congress.city);
        });
    }
}
exports.CongressService = CongressService;
