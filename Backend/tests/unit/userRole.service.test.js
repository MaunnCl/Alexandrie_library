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
const usersRoles_service_1 = require("../../src/services/usersRoles.service");
const usersRoles_repository_1 = require("../../src/repository/usersRoles.repository");
jest.mock("../../src/repository/usersRoles.repository");
describe("UsersRolesService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should create a user-role", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockData = { user_id: 1, role_id: "uuid-role" };
        const mockResult = Object.assign({ id: "uuid" }, mockData);
        usersRoles_repository_1.UsersRolesRepository.create.mockResolvedValue(mockResult);
        const result = yield usersRoles_service_1.UsersRolesService.create(mockData);
        expect(result).toEqual(mockResult);
        expect(usersRoles_repository_1.UsersRolesRepository.create).toHaveBeenCalledWith(mockData);
    }));
    it("should return all user-roles", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockResult = [{ id: "uuid", user_id: 1, role_id: "uuid-role" }];
        usersRoles_repository_1.UsersRolesRepository.findAll.mockResolvedValue(mockResult);
        const result = yield usersRoles_service_1.UsersRolesService.getAll();
        expect(result).toEqual(mockResult);
    }));
    it("should return a user-role by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockResult = { id: "uuid", user_id: 1, role_id: "uuid-role" };
        usersRoles_repository_1.UsersRolesRepository.findById.mockResolvedValue(mockResult);
        const result = yield usersRoles_service_1.UsersRolesService.getById("uuid");
        expect(result).toEqual(mockResult);
    }));
    it("should update a user-role", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUpdate = { role_id: "uuid-updated" };
        const mockResult = { id: "uuid", user_id: 1, role_id: "uuid-updated" };
        usersRoles_repository_1.UsersRolesRepository.update.mockResolvedValue(mockResult);
        const result = yield usersRoles_service_1.UsersRolesService.update("uuid", mockUpdate);
        expect(result).toEqual(mockResult);
    }));
    it("should delete a user-role", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockResult = { id: "uuid", user_id: 1, role_id: "uuid-role" };
        usersRoles_repository_1.UsersRolesRepository.delete.mockResolvedValue(mockResult);
        const result = yield usersRoles_service_1.UsersRolesService.delete("uuid");
        expect(result).toEqual(mockResult);
    }));
});
