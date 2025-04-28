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
const congress_service_1 = require("../../src/services/congress.service");
const congress_repository_1 = require("../../src/repository/congress.repository");
jest.mock("../../src/repository/congress.repository");
describe("CongressService", () => {
    beforeEach(() => jest.clearAllMocks());
    it("should create a congress", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCongress = {
            id: 1,
            name: "Test Congress",
            key: "test-key",
            session_ids: [],
            picture: null,
            date: "2025-04-15",
            city: "Paris",
        };
        congress_repository_1.CongressRepository.create.mockResolvedValue(mockCongress);
        const congress = yield congress_service_1.CongressService.create("Test Congress", "test-key", [], null, "2025-04-15", "Paris");
        expect(congress.id).toBe(1);
        expect(congress.name).toBe("Test Congress");
        expect(congress_repository_1.CongressRepository.create).toHaveBeenCalledWith("Test Congress", "test-key", [], null, "2025-04-15", "Paris");
    }));
    it("should get congress by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCongress = {
            id: 1,
            name: "Test Congress",
            key: "test-key",
            session_ids: [],
            picture: null,
            date: "2025-04-15",
            city: "Paris",
        };
        congress_repository_1.CongressRepository.findById.mockResolvedValue(mockCongress);
        const congress = yield congress_service_1.CongressService.getById(1);
        expect(congress.id).toBe(1);
        expect(congress.name).toBe("Test Congress");
        expect(congress_repository_1.CongressRepository.findById).toHaveBeenCalledWith(1);
    }));
    it("should update a congress", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUpdatedCongress = {
            id: 1,
            name: "Updated Congress",
            key: "updated-key",
            session_ids: [],
            picture: null,
            date: "2025-04-16",
            city: "Lyon",
        };
        congress_repository_1.CongressRepository.update.mockResolvedValue(mockUpdatedCongress);
        const updatedCongress = yield congress_service_1.CongressService.update(1, "Updated Congress", "updated-key", [], null, "2025-04-16", "Lyon");
        expect(updatedCongress.name).toBe("Updated Congress");
        expect(congress_repository_1.CongressRepository.update).toHaveBeenCalledWith(1, "Updated Congress", "updated-key", [], null, "2025-04-16", "Lyon");
    }));
    it("should delete a congress", () => __awaiter(void 0, void 0, void 0, function* () {
        congress_repository_1.CongressRepository.delete.mockResolvedValue(true);
        yield expect(congress_service_1.CongressService.delete(1)).resolves.not.toThrow();
        expect(congress_repository_1.CongressRepository.delete).toHaveBeenCalledWith(1);
    }));
    it("should add session id to congress", () => __awaiter(void 0, void 0, void 0, function* () {
        const initialCongress = {
            id: 1,
            name: "Congress",
            key: "key",
            session_ids: [],
            picture: null,
            date: "2025-04-15",
            city: "Paris"
        };
        const updatedCongressMock = Object.assign(Object.assign({}, initialCongress), { session_ids: [2] });
        congress_repository_1.CongressRepository.findById.mockResolvedValue(initialCongress);
        congress_repository_1.CongressRepository.update.mockResolvedValue(updatedCongressMock);
        const updatedCongress = yield congress_service_1.CongressService.addSessionToCongress(1, 2);
        expect(updatedCongress.session_ids).toContain(2);
        expect(congress_repository_1.CongressRepository.update).toHaveBeenCalledWith(1, "Congress", "key", [2], null, "2025-04-15", "Paris");
    }));
    it("should remove session id from congress", () => __awaiter(void 0, void 0, void 0, function* () {
        const initialCongress = {
            id: 1,
            name: "Congress",
            key: "key",
            session_ids: [2],
            picture: null,
            date: "2025-04-15",
            city: "Paris"
        };
        const updatedCongressMock = Object.assign(Object.assign({}, initialCongress), { session_ids: [] });
        congress_repository_1.CongressRepository.findById.mockResolvedValue(initialCongress);
        congress_repository_1.CongressRepository.update.mockResolvedValue(updatedCongressMock);
        const updatedCongress = yield congress_service_1.CongressService.removeSessionFromCongress(1, 2);
        expect(updatedCongress.session_ids).not.toContain(2);
        expect(congress_repository_1.CongressRepository.update).toHaveBeenCalledWith(1, "Congress", "key", [], null, "2025-04-15", "Paris");
    }));
});
