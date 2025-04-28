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
exports.OratorsController = void 0;
const orators_service_1 = require("../services/orators.service");
class OratorsController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, picture, content_ids, country, city } = req.body;
            try {
                const orator = yield orators_service_1.OratorsService.create({ name, picture, content_ids, country, city });
                res.status(201).json(orator);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orators = yield orators_service_1.OratorsService.getAll();
                res.status(200).json(orators);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const orator = yield orators_service_1.OratorsService.getById(Number(id));
                if (!orator) {
                    res.status(404).json({ message: "Orator not found" });
                    return;
                }
                res.status(200).json(orator);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, picture, content_ids, country, city } = req.body;
            try {
                const updatedOrator = yield orators_service_1.OratorsService.update(Number(id), { name, picture, content_ids, country, city });
                res.status(200).json(updatedOrator);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield orators_service_1.OratorsService.delete(Number(id));
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static updatePhoto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, photoUrl } = req.body;
            try {
                const updated = yield orators_service_1.OratorsService.updatePhoto(Number(id), photoUrl);
                res.status(200).json(updated);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static addContentToOrator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oratorId = Number(req.params.oratorId);
                const contentId = Number(req.params.contentId);
                const updated = yield orators_service_1.OratorsService.addContentToOrator(oratorId, contentId);
                res.status(200).json(updated);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static removeContentFromOrator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oratorId = Number(req.params.oratorId);
                const contentId = Number(req.params.contentId);
                const updated = yield orators_service_1.OratorsService.removeContentFromOrator(oratorId, contentId);
                res.status(200).json(updated);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.OratorsController = OratorsController;
