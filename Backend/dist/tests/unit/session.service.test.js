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
const session_service_1 = require("../../src/services/session.service");
const session_repository_1 = require("../../src/repository/session.repository");
jest.mock("../../src/repository/session.repository");
describe("SessionService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should create a session", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockSession = { id: 1, name: "Test Session", content_ids: [] };
        session_repository_1.SessionRepository.create.mockResolvedValue(mockSession);
        const session = yield session_service_1.SessionService.create("Test Session", []);
        expect(session.id).toBe(1);
        expect(session.name).toBe("Test Session");
        expect(session_repository_1.SessionRepository.create).toHaveBeenCalledWith("Test Session", []);
    }));
    it("should get session by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockSession = { id: 1, name: "Test Session", content_ids: [] };
        session_repository_1.SessionRepository.findById.mockResolvedValue(mockSession);
        const session = yield session_service_1.SessionService.getById(1);
        expect(session.id).toBe(1);
        expect(session.name).toBe("Test Session");
        expect(session_repository_1.SessionRepository.findById).toHaveBeenCalledWith(1);
    }));
    it("should update a session", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUpdatedSession = { id: 1, name: "Updated Session", content_ids: [1] };
        session_repository_1.SessionRepository.update.mockResolvedValue(mockUpdatedSession);
        const updatedSession = yield session_service_1.SessionService.update(1, "Updated Session", [1]);
        expect(updatedSession.name).toBe("Updated Session");
        expect(updatedSession.content_ids).toContain(1);
        expect(session_repository_1.SessionRepository.update).toHaveBeenCalledWith(1, "Updated Session", [1]);
    }));
    it("should delete a session", () => __awaiter(void 0, void 0, void 0, function* () {
        session_repository_1.SessionRepository.delete.mockResolvedValue(true);
        yield expect(session_service_1.SessionService.delete(1)).resolves.not.toThrow();
        expect(session_repository_1.SessionRepository.delete).toHaveBeenCalledWith(1);
    }));
    it("should add content to session", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockSession = { id: 1, name: "Session", content_ids: [2, 3] };
        session_repository_1.SessionRepository.findById.mockResolvedValue(mockSession);
        session_repository_1.SessionRepository.update.mockResolvedValue(Object.assign(Object.assign({}, mockSession), { content_ids: [2, 3, 4] }));
        const updatedSession = yield session_service_1.SessionService.addContentToSession(1, 4);
        expect(updatedSession.content_ids).toContain(4);
        expect(session_repository_1.SessionRepository.update).toHaveBeenCalledWith(1, "Session", [2, 3, 4]);
    }));
    it("should remove content from session", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockSession = { id: 1, name: "Session", content_ids: [2, 3, 4] };
        session_repository_1.SessionRepository.findById.mockResolvedValue(mockSession);
        session_repository_1.SessionRepository.update.mockResolvedValue(Object.assign(Object.assign({}, mockSession), { content_ids: [2, 3] }));
        const updatedSession = yield session_service_1.SessionService.removeContentFromSession(1, 4);
        expect(updatedSession.content_ids).not.toContain(4);
        expect(session_repository_1.SessionRepository.update).toHaveBeenCalledWith(1, "Session", [2, 3]);
    }));
});
