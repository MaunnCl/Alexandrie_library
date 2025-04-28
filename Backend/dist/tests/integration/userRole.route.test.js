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
describe("UsersRoles routes", () => {
    let userId;
    let roleId;
    let userRoleId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const userRes = yield (0, supertest_1.default)(app_1.default).post("/api/users").send({
            firstname: "Test",
            lastname: "User",
            email: "test-user-role@example.com",
            password: "test1234"
        });
        userId = userRes.body.id;
        const roleRes = yield (0, supertest_1.default)(app_1.default).post("/api/roles").send({
            role_name: "editor",
            description: "Role for editing content"
        });
        roleId = roleRes.body.id;
    }));
    it("should create a user-role", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/users-roles")
            .send({
            user_id: userId,
            role_id: roleId
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.user_id).toBe(userId);
        expect(res.body.role_id).toBe(roleId);
        userRoleId = res.body.id;
    }));
    it("should get a user-role by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/users-roles/${userRoleId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(userRoleId);
    }));
    it("should update a user-role", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/users-roles/${userRoleId}`)
            .send({ role_id: roleId });
        expect(res.status).toBe(200);
        expect(res.body.role_id).toBe(roleId);
    }));
    it("should delete a user-role", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/users-roles/${userRoleId}`);
        expect(res.status).toBe(204);
    }));
    it("should delete the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/users/${userId}`);
        expect(res.status).toBe(204);
    }));
});
