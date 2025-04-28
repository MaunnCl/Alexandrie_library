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
describe("Congress Routes", () => {
    let congressId;
    it("should create a congress", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/api/congress").send({
            name: "Test Congress",
            key: "test-key",
            session_ids: [],
            picture: null,
            date: "2025-04-15",
            city: "Paris"
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        congressId = response.body.id;
    }));
    it("should get a congress by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get(`/api/congress/${congressId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(congressId);
    }));
    it("should update a congress", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).put(`/api/congress/${congressId}`).send({
            name: "Updated Congress",
            key: "updated-key",
            session_ids: [],
            picture: null,
            date: "2025-04-16",
            city: "Lyon"
        });
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Updated Congress");
    }));
    it("should add session to congress", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post(`/api/congress/${congressId}/session/2`);
        expect(response.status).toBe(200);
        expect(response.body.session_ids).toContain(2);
    }));
    it("should remove session from congress", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).delete(`/api/congress/${congressId}/session/2`);
        expect(response.status).toBe(200);
        expect(response.body.session_ids).not.toContain(2);
    }));
    it("should delete a congress", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).delete(`/api/congress/${congressId}`);
        expect(response.status).toBe(204);
    }));
});
