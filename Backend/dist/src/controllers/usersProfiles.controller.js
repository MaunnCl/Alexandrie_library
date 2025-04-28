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
exports.UsersProfilesController = void 0;
const usersProfiles_service_1 = require("../services/usersProfiles.service");
class UsersProfilesController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield usersProfiles_service_1.UsersProfilesService.create(req.body);
                res.status(201).json(profile);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profiles = yield usersProfiles_service_1.UsersProfilesService.getAll();
                res.status(200).json(profiles);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield usersProfiles_service_1.UsersProfilesService.getById(req.params.id);
                if (!profile) {
                    res.status(404).json({ message: "Profile not found" });
                    return;
                }
                res.status(200).json(profile);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedProfile = yield usersProfiles_service_1.UsersProfilesService.update(req.params.id, req.body);
                res.status(200).json(updatedProfile);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield usersProfiles_service_1.UsersProfilesService.delete(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.UsersProfilesController = UsersProfilesController;
