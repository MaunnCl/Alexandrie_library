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
exports.RoleRepository = void 0;
const database_1 = require("../../config/database");
const role_1 = require("../schemas/role");
const drizzle_orm_1 = require("drizzle-orm");
class RoleRepository {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.insert(role_1.roleList).values(data).returning();
            return result[0];
        });
    }
    static findAll() {
        return database_1.db.select().from(role_1.roleList);
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.select().from(role_1.roleList).where((0, drizzle_orm_1.eq)(role_1.roleList.id, id));
            return result[0];
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.update(role_1.roleList).set(data).where((0, drizzle_orm_1.eq)(role_1.roleList.id, id)).returning();
            return result[0];
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.delete(role_1.roleList).where((0, drizzle_orm_1.eq)(role_1.roleList.id, id)).returning();
            return result[0];
        });
    }
}
exports.RoleRepository = RoleRepository;
