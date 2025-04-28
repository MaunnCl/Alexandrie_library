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
describe("Users routes", () => {
    let createdUserId;
    it("should create a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post("/api/users").send({
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@example.com",
            password: "pass1234"
        });
        expect(res.status).toBe(201);
        expect(res.body.email).toBe("john.doe@example.com");
        createdUserId = res.body.id;
    }));
    it("should get all users", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/users");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }));
    it("should get user by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/users/${createdUserId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(createdUserId);
    }));
    it("should update a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/users/${createdUserId}`)
            .send({ firstname: "Johnny" });
        expect(res.status).toBe(200);
        expect(res.body.firstname).toBe("Johnny");
    }));
    it("should delete a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/users/${createdUserId}`);
        expect(res.status).toBe(204);
    }));
});
