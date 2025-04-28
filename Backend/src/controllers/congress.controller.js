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
exports.CongressController = void 0;
const congress_service_1 = require("../services/congress.service");
class CongressController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, key, session_ids, picture, date, city } = req.body;
                const congress = yield congress_service_1.CongressService.create(name, key, session_ids, picture, date, city);
                res.status(201).json(congress);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const congressList = yield congress_service_1.CongressService.getAll();
                res.status(200).json(congressList);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const congress = yield congress_service_1.CongressService.getById(Number(req.params.id));
                if (!congress) {
                    res.status(404).json({ message: "Congress not found" });
                    return;
                }
                res.status(200).json(congress);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, key, session_ids, picture, date, city } = req.body;
                const updated = yield congress_service_1.CongressService.update(Number(req.params.id), name, key, session_ids, picture, date, city);
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
                yield congress_service_1.CongressService.delete(Number(req.params.id));
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static addSessionToCongress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield congress_service_1.CongressService.addSessionToCongress(Number(req.params.congressId), Number(req.params.sessionId));
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    static removeSessionFromCongress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield congress_service_1.CongressService.removeSessionFromCongress(Number(req.params.congressId), Number(req.params.sessionId));
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.CongressController = CongressController;
