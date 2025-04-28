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
exports.ContentService = void 0;
const content_repository_1 = require("../repository/content.repository");
class ContentService {
    static create(title, orator_id, description, url, timeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            return content_repository_1.ContentRepository.create(title, orator_id, description, url, timeStamp);
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return content_repository_1.ContentRepository.findAll();
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return content_repository_1.ContentRepository.findById(id);
        });
    }
    static update(id, title, orator_id, description, url, timeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            return content_repository_1.ContentRepository.update(id, title, orator_id, description, url, timeStamp);
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return content_repository_1.ContentRepository.delete(id);
        });
    }
    static addContentToOrator(contentId, oratorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return content_repository_1.ContentRepository.updateOrator(contentId, { orator_id: oratorId });
        });
    }
    static removeContentFromOrator(contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return content_repository_1.ContentRepository.updateOrator(contentId, { orator_id: null });
        });
    }
}
exports.ContentService = ContentService;
