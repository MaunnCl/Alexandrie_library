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
describe("Orators Routes", () => {
    let createdOratorId;
    it("should create an orator", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/api/orators")
            .send({
            name: "Test Orator",
            picture: "http://test.com",
            country: "France",
            city: "Paris"
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        createdOratorId = response.body.id;
    }));
    it("should get an orator by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/orators/${createdOratorId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createdOratorId);
    }));
    it("should update an orator", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/orators/${createdOratorId}`)
            .send({ name: "Updated Orator" });
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Updated Orator");
    }));
    it("should add content id to orator", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/api/orators/${createdOratorId}/content/3`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("content_ids");
        expect(Array.isArray(response.body.content_ids)).toBe(true);
        expect(response.body.content_ids).toContain(3);
    }));
    it("should remove content id from orator", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/orators/${createdOratorId}/content/3`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("content_ids");
        expect(Array.isArray(response.body.content_ids)).toBe(true);
        expect(response.body.content_ids).not.toContain(3);
    }));
    it("should delete an orator", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/orators/${createdOratorId}`);
        expect(response.status).toBe(204);
    }));
});
