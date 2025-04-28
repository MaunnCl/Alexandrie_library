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
const usersProfiles_service_1 = require("../../src/services/usersProfiles.service");
const usersProfiles_repository_1 = require("../../src/repository/usersProfiles.repository");
jest.mock("../../src/repository/usersProfiles.repository");
describe("UsersProfilesService", () => {
    const mockProfile = {
        id: "uuid-profile",
        user_id: 1,
        profilePicture: "url",
        bio: "bio text",
        preferences: "pref"
    };
    it("should create a user profile", () => __awaiter(void 0, void 0, void 0, function* () {
        usersProfiles_repository_1.UsersProfilesRepository.create.mockResolvedValue(mockProfile);
        const result = yield usersProfiles_service_1.UsersProfilesService.create(mockProfile);
        expect(result).toEqual(mockProfile);
        expect(usersProfiles_repository_1.UsersProfilesRepository.create).toHaveBeenCalledWith(mockProfile);
    }));
    it("should return all profiles", () => __awaiter(void 0, void 0, void 0, function* () {
        usersProfiles_repository_1.UsersProfilesRepository.findAll.mockResolvedValue([mockProfile]);
        const result = yield usersProfiles_service_1.UsersProfilesService.getAll();
        expect(result).toEqual([mockProfile]);
    }));
    it("should get profile by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        usersProfiles_repository_1.UsersProfilesRepository.findById.mockResolvedValue(mockProfile);
        const result = yield usersProfiles_service_1.UsersProfilesService.getById("uuid-profile");
        expect(result).toEqual(mockProfile);
    }));
    it("should update a profile", () => __awaiter(void 0, void 0, void 0, function* () {
        usersProfiles_repository_1.UsersProfilesRepository.update.mockResolvedValue(mockProfile);
        const result = yield usersProfiles_service_1.UsersProfilesService.update("uuid-profile", { bio: "updated" });
        expect(result).toEqual(mockProfile);
        expect(usersProfiles_repository_1.UsersProfilesRepository.update).toHaveBeenCalledWith("uuid-profile", { bio: "updated" });
    }));
    it("should delete a profile", () => __awaiter(void 0, void 0, void 0, function* () {
        usersProfiles_repository_1.UsersProfilesRepository.delete.mockResolvedValue(mockProfile);
        const result = yield usersProfiles_service_1.UsersProfilesService.delete("uuid-profile");
        expect(result).toEqual(mockProfile);
        expect(usersProfiles_repository_1.UsersProfilesRepository.delete).toHaveBeenCalledWith("uuid-profile");
    }));
});
