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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
process.env.NODE_ENV = 'test';
describe("Role routes", () => {
    let createdRoleId;
    it("should create a new role", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/roles")
            .send({
            role_name: "admin",
            description: "Administrateur avec accès complet",
        });
        expect(res.status).toBe(201);
        expect(res.body.role_name).toBe("admin");
        createdRoleId = res.body.id;
    }));
    it("should get all roles", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/roles");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }));
    it("should get role by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/roles/${createdRoleId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(createdRoleId);
    }));
    it("should update a role", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/roles/${createdRoleId}`)
            .send({
            role_name: "updated_admin",
            description: "Mise à jour du rôle admin",
        });
        expect(res.status).toBe(200);
        expect(res.body.role_name).toBe("updated_admin");
    }));
    it("should delete a role", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/roles/${createdRoleId}`);
        expect(res.status).toBe(204);
    }));
});
