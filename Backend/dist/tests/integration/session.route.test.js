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
let createdSessionId;
describe("Session Routes", () => {
    it("should create a session", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/api/sessions")
            .send({
            name: "Test Session",
            content_ids: []
        });
        console.log("CREATE SESSION RESPONSE:", response.status, response.body);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        createdSessionId = response.body.id;
    }));
    it("should get session by id", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(createdSessionId).toBeDefined();
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/sessions/${createdSessionId}`);
        console.log("GET SESSION RESPONSE:", response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createdSessionId);
        expect(response.body.name).toBe("Test Session");
    }));
    it("should update a session", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(createdSessionId).toBeDefined();
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/sessions/${createdSessionId}`)
            .send({ name: "Updated Session", content_ids: [1] });
        console.log("UPDATE SESSION RESPONSE:", response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Updated Session");
        expect(response.body.content_ids).toContain(1);
    }));
    it("should add content to session", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(createdSessionId).toBeDefined();
        const response = yield (0, supertest_1.default)(app_1.default)
            .patch(`/api/sessions/${createdSessionId}/add/2`);
        console.log("ADD CONTENT TO SESSION RESPONSE:", response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body.content_ids).toContain(2);
    }));
    it("should remove content from session", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(createdSessionId).toBeDefined();
        const response = yield (0, supertest_1.default)(app_1.default)
            .patch(`/api/sessions/${createdSessionId}/remove/2`);
        console.log("REMOVE CONTENT FROM SESSION RESPONSE:", response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body.content_ids).not.toContain(2);
    }));
    it("should delete a session", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(createdSessionId).toBeDefined();
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/sessions/${createdSessionId}`);
        console.log("DELETE SESSION RESPONSE:", response.status);
        expect(response.status).toBe(204);
    }));
    it("should return 404 when session does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/api/sessions/9999");
        console.log("GET NON-EXISTING SESSION RESPONSE:", response.status, response.body);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Session not found");
    }));
});
