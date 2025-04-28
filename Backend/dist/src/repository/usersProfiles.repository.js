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
exports.UsersProfilesRepository = void 0;
const database_1 = require("../../config/database");
const profile_1 = require("../schemas/profile");
const drizzle_orm_1 = require("drizzle-orm");
class UsersProfilesRepository {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.insert(profile_1.usersProfiles).values(data).returning();
            return result[0];
        });
    }
    static findAll() {
        return database_1.db.select().from(profile_1.usersProfiles);
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.select().from(profile_1.usersProfiles).where((0, drizzle_orm_1.eq)(profile_1.usersProfiles.id, id));
            return result[0];
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.update(profile_1.usersProfiles).set(data).where((0, drizzle_orm_1.eq)(profile_1.usersProfiles.id, id)).returning();
            return result[0];
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.delete(profile_1.usersProfiles).where((0, drizzle_orm_1.eq)(profile_1.usersProfiles.id, id)).returning();
            return result[0];
        });
    }
}
exports.UsersProfilesRepository = UsersProfilesRepository;
