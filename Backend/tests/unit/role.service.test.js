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
const role_service_1 = require("../../src/services/role.service");
const role_repository_1 = require("../../src/repository/role.repository");
jest.mock("../../src/repository/role.repository");
describe("RoleService", () => {
    const roleMock = {
        id: "uuid-123",
        role_name: "admin",
        description: "Admin description",
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should create a role", () => __awaiter(void 0, void 0, void 0, function* () {
        role_repository_1.RoleRepository.create.mockResolvedValue(roleMock);
        const result = yield role_service_1.RoleService.create({
            role_name: "admin",
            description: "Admin description",
        });
        expect(result).toEqual(roleMock);
        expect(role_repository_1.RoleRepository.create).toHaveBeenCalledWith({
            role_name: "admin",
            description: "Admin description",
        });
    }));
    it("should get all roles", () => __awaiter(void 0, void 0, void 0, function* () {
        role_repository_1.RoleRepository.findAll.mockResolvedValue([roleMock]);
        const result = yield role_service_1.RoleService.getAll();
        expect(result).toEqual([roleMock]);
    }));
    it("should get role by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        role_repository_1.RoleRepository.findById.mockResolvedValue(roleMock);
        const result = yield role_service_1.RoleService.getById("uuid-123");
        expect(result).toEqual(roleMock);
    }));
    it("should update role", () => __awaiter(void 0, void 0, void 0, function* () {
        role_repository_1.RoleRepository.update.mockResolvedValue(Object.assign(Object.assign({}, roleMock), { role_name: "new_role" }));
        const result = yield role_service_1.RoleService.update("uuid-123", {
            role_name: "new_role",
        });
        expect(result.role_name).toBe("new_role");
    }));
    it("should delete role", () => __awaiter(void 0, void 0, void 0, function* () {
        role_repository_1.RoleRepository.delete.mockResolvedValue(roleMock);
        const result = yield role_service_1.RoleService.delete("uuid-123");
        expect(result).toEqual(roleMock);
    }));
});
