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
describe("Content Routes", () => {
    let contentId;
    it("should create a content", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/api/contents")
            .send({
            title: "Test Content",
            orator_id: 1,
            description: "Test description",
            url: "http://test.com",
            timeStamp: "test"
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        contentId = response.body.id;
    }));
    it("should get a content by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get(`/api/contents/${contentId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", contentId);
    }));
    it("should return 404 when content is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/api/contents/99999");
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Content not found");
    }));
    it("should update a content", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/contents/${contentId}`)
            .send({
            title: "Updated Content",
            orator_id: 1,
            description: "Updated description",
            url: "http://updated.com",
            timeStamp: "update"
        });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Updated Content");
    }));
    it("should link content to an orator", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/contents/${contentId}/orator/2`);
        expect(response.status).toBe(200);
        expect(response.body.orator_id).toBe(2);
    }));
    it("should unlink content from an orator", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/contents/${contentId}/orator`);
        expect(response.status).toBe(200);
        expect(response.body.orator_id).toBeNull();
    }));
    it("should delete a content", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).delete(`/api/contents/${contentId}`);
        expect(response.status).toBe(204);
    }));
});
