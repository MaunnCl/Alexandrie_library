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
exports.ContentController = void 0;
const content_service_1 = require("../services/content.service");
class ContentController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, orator_id, description, url, timeStamp } = req.body;
                const content = yield content_service_1.ContentService.create(title, Number(orator_id), description, url, timeStamp);
                res.status(201).json(content);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contents = yield content_service_1.ContentService.getAll();
                res.status(200).json(contents);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = yield content_service_1.ContentService.getById(Number(req.params.id));
                if (!content) {
                    res.status(404).json({ message: "Content not found" });
                    return;
                }
                res.status(200).json(content);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, orator_id, description, url, timeStamp } = req.body;
                const updated = yield content_service_1.ContentService.update(Number(req.params.id), title, Number(orator_id), description, url, timeStamp);
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
                yield content_service_1.ContentService.delete(Number(req.params.id));
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static addContentToOrator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contentId, oratorId } = req.params;
            try {
                const updatedContent = yield content_service_1.ContentService.addContentToOrator(Number(contentId), Number(oratorId));
                res.status(200).json(updatedContent);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static removeContentFromOrator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contentId } = req.params;
            try {
                const updatedContent = yield content_service_1.ContentService.removeContentFromOrator(Number(contentId));
                res.status(200).json(updatedContent);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.ContentController = ContentController;
