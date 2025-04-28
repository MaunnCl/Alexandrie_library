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
exports.UsersRepository = void 0;
const database_1 = require("../../config/database");
const user_1 = require("../schemas/user");
const drizzle_orm_1 = require("drizzle-orm");
class UsersRepository {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.insert(user_1.users).values(data).returning();
            return result[0];
        });
    }
    static findAll() {
        return database_1.db.select().from(user_1.users);
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.select().from(user_1.users).where((0, drizzle_orm_1.eq)(user_1.users.id, id));
            return result[0];
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.update(user_1.users).set(data).where((0, drizzle_orm_1.eq)(user_1.users.id, id)).returning();
            return result[0];
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.delete(user_1.users).where((0, drizzle_orm_1.eq)(user_1.users.id, id)).returning();
            return result[0];
        });
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.select().from(user_1.users).where((0, drizzle_orm_1.eq)(user_1.users.email, email));
            return result[0];
        });
    }
}
exports.UsersRepository = UsersRepository;
