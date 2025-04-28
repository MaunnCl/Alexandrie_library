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
let createdId;
const profileData = {
    user_id: 1,
    profilePicture: "picture.jpg",
    bio: "Hello I am a bio",
    preferences: "dark",
};
describe("UsersProfiles routes", () => {
    it("should create a profile", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post("/api/users-profiles").send(profileData);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        createdId = res.body.id;
    }));
    it("should get all profiles", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/users-profiles");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }));
    it("should get profile by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/users-profiles/${createdId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(createdId);
    }));
    it("should update a profile", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/users-profiles/${createdId}`)
            .send({ bio: "Updated bio" });
        expect(res.status).toBe(200);
        expect(res.body.bio).toBe("Updated bio");
    }));
    it("should delete a profile", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/users-profiles/${createdId}`);
        expect(res.status).toBe(204);
    }));
});
