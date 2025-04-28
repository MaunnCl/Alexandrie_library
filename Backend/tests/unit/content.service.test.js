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
const content_service_1 = require("../../src/services/content.service");
const content_repository_1 = require("../../src/repository/content.repository");
jest.mock("../../src/repository/content.repository");
describe("ContentService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should create a content", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockContent = {
            id: 1,
            title: "Test Content",
            orator_id: 1,
            description: "Description",
            url: "http://test.com",
            timeStamp: "test"
        };
        content_repository_1.ContentRepository.create.mockResolvedValue(mockContent);
        const content = yield content_service_1.ContentService.create("Test Content", 1, "Description", "http://test.com", "test");
        expect(content.id).toBe(1);
        expect(content.title).toBe("Test Content");
        expect(content_repository_1.ContentRepository.create).toHaveBeenCalledWith("Test Content", 1, "Description", "http://test.com", "test");
    }));
    it("should get content by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockContent = {
            id: 1,
            title: "Test Content",
            orator_id: 1,
            description: "Description",
            url: "http://test.com",
            timeStamp: "test"
        };
        content_repository_1.ContentRepository.findById.mockResolvedValue(mockContent);
        const content = yield content_service_1.ContentService.getById(1);
        expect(content.id).toBe(1);
        expect(content.title).toBe("Test Content");
        expect(content_repository_1.ContentRepository.findById).toHaveBeenCalledWith(1);
    }));
    it("should update a content", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUpdatedContent = {
            id: 1,
            title: "Updated Content",
            orator_id: 1,
            description: "Updated Description",
            url: "http://updated.com",
            timeStamp: "update"
        };
        content_repository_1.ContentRepository.update.mockResolvedValue(mockUpdatedContent);
        const updatedContent = yield content_service_1.ContentService.update(1, "Updated Content", 1, "Updated Description", "http://updated.com", "update");
        expect(updatedContent.title).toBe("Updated Content");
        expect(content_repository_1.ContentRepository.update).toHaveBeenCalledWith(1, "Updated Content", 1, "Updated Description", "http://updated.com", "update");
    }));
    it("should delete a content", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockDeletedContent = {
            id: 1,
            title: "Deleted Content",
            orator_id: 1,
            description: "Deleted Description",
            url: "http://deleted.com",
            timeStamp: "delete"
        };
        content_repository_1.ContentRepository.delete.mockResolvedValue(mockDeletedContent);
        const deletedContent = yield content_service_1.ContentService.delete(1);
        expect(deletedContent.id).toBe(1);
        expect(content_repository_1.ContentRepository.delete).toHaveBeenCalledWith(1);
    }));
    it("should link content to an orator", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockLinkedContent = { id: 1, orator_id: 2, title: "Content", description: "", url: "", timeStamp: "" };
        content_repository_1.ContentRepository.updateOrator.mockResolvedValue(mockLinkedContent);
        const updatedContent = yield content_service_1.ContentService.addContentToOrator(1, 2);
        expect(updatedContent.orator_id).toBe(2);
        expect(content_repository_1.ContentRepository.updateOrator).toHaveBeenCalledWith(1, { orator_id: 2 });
    }));
    it("should unlink content from an orator", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUnlinkedContent = { id: 1, orator_id: null, title: "Content", description: "", url: "", timeStamp: "" };
        content_repository_1.ContentRepository.updateOrator.mockResolvedValue(mockUnlinkedContent);
        const updatedContent = yield content_service_1.ContentService.removeContentFromOrator(1);
        expect(updatedContent.orator_id).toBeNull();
        expect(content_repository_1.ContentRepository.updateOrator).toHaveBeenCalledWith(1, { orator_id: null });
    }));
});
