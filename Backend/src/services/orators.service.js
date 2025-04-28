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
exports.OratorsService = void 0;
const orators_repository_1 = require("../repository/orators.repository");
class OratorsService {
    static create(data) {
        return orators_repository_1.OratorsRepository.create(data);
    }
    static getAll() {
        return orators_repository_1.OratorsRepository.findAll();
    }
    static getById(id) {
        return orators_repository_1.OratorsRepository.findById(id);
    }
    static update(id, data) {
        return orators_repository_1.OratorsRepository.update(id, data);
    }
    static delete(id) {
        return orators_repository_1.OratorsRepository.delete(id);
    }
    static updatePhoto(id, photoUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return orators_repository_1.OratorsRepository.update(id, { picture: photoUrl });
        });
    }
    static addContentToOrator(oratorId, contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orator = yield orators_repository_1.OratorsRepository.findById(oratorId);
            if (!orator)
                throw new Error("Orator not found");
            const updatedList = Array.isArray(orator.content_ids) ? [...orator.content_ids] : [];
            if (!updatedList.includes(contentId))
                updatedList.push(contentId);
            return orators_repository_1.OratorsRepository.update(oratorId, { content_ids: updatedList });
        });
    }
    static removeContentFromOrator(oratorId, contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orator = yield orators_repository_1.OratorsRepository.findById(oratorId);
            if (!orator)
                throw new Error("Orator not found");
            const updatedList = Array.isArray(orator.content_ids)
                ? orator.content_ids.filter(id => id !== contentId)
                : [];
            return orators_repository_1.OratorsRepository.update(oratorId, { content_ids: updatedList });
        });
    }
}
exports.OratorsService = OratorsService;
