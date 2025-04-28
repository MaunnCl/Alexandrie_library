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
const orators_service_1 = require("../../src/services/orators.service");
const orators_repository_1 = require("../../src/repository/orators.repository");
jest.mock("../../src/repository/orators.repository");
describe("OratorsService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should create an orator", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockOrator = {
            id: 1,
            name: "Orator 1",
            picture: "http://image.com",
            content_ids: [],
            country: "France",
            city: "Paris"
        };
        orators_repository_1.OratorsRepository.create.mockResolvedValue(mockOrator);
        const orator = yield orators_service_1.OratorsService.create(mockOrator);
        expect(orator.id).toBe(1);
        expect(orator.name).toBe("Orator 1");
        expect(orators_repository_1.OratorsRepository.create).toHaveBeenCalledWith(mockOrator);
    }));
    it("should get an orator by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockOrator = { id: 1, name: "Orator 1" };
        orators_repository_1.OratorsRepository.findById.mockResolvedValue(mockOrator);
        const orator = yield orators_service_1.OratorsService.getById(1);
        expect(orator.id).toBe(1);
        expect(orator.name).toBe("Orator 1");
        expect(orators_repository_1.OratorsRepository.findById).toHaveBeenCalledWith(1);
    }));
    it("should update an orator", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUpdatedOrator = {
            id: 1,
            name: "Updated Orator",
            picture: "http://updated.com",
            content_ids: [],
            country: "USA",
            city: "NY"
        };
        orators_repository_1.OratorsRepository.update.mockResolvedValue(mockUpdatedOrator);
        const updatedOrator = yield orators_service_1.OratorsService.update(1, mockUpdatedOrator);
        expect(updatedOrator.name).toBe("Updated Orator");
        expect(orators_repository_1.OratorsRepository.update).toHaveBeenCalledWith(1, mockUpdatedOrator);
    }));
    it("should delete an orator", () => __awaiter(void 0, void 0, void 0, function* () {
        orators_repository_1.OratorsRepository.delete.mockResolvedValue(true);
        yield expect(orators_service_1.OratorsService.delete(1)).resolves.not.toThrow();
        expect(orators_repository_1.OratorsRepository.delete).toHaveBeenCalledWith(1);
    }));
    it("should add content id to orator", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockOrator = { id: 1, content_ids: [2] };
        orators_repository_1.OratorsRepository.findById.mockResolvedValue(mockOrator);
        orators_repository_1.OratorsRepository.update.mockResolvedValue(Object.assign(Object.assign({}, mockOrator), { content_ids: [2, 3] }));
        const updatedOrator = yield orators_service_1.OratorsService.addContentToOrator(1, 3);
        expect(updatedOrator.content_ids).toContain(3);
        expect(orators_repository_1.OratorsRepository.update).toHaveBeenCalledWith(1, { content_ids: [2, 3] });
    }));
    it("should remove content id from orator", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockOrator = { id: 1, content_ids: [2, 3] };
        orators_repository_1.OratorsRepository.findById.mockResolvedValue(mockOrator);
        orators_repository_1.OratorsRepository.update.mockResolvedValue(Object.assign(Object.assign({}, mockOrator), { content_ids: [2] }));
        const updatedOrator = yield orators_service_1.OratorsService.removeContentFromOrator(1, 3);
        expect(updatedOrator.content_ids).not.toContain(3);
        expect(orators_repository_1.OratorsRepository.update).toHaveBeenCalledWith(1, { content_ids: [2] });
    }));
});
