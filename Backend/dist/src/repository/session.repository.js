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
exports.SessionRepository = void 0;
const database_1 = require("../../config/database");
const session_1 = require("../schemas/session");
const drizzle_orm_1 = require("drizzle-orm");
class SessionRepository {
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.select().from(session_1.sessionTable).where((0, drizzle_orm_1.eq)(session_1.sessionTable.id, id));
            return result[0];
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.db.select().from(session_1.sessionTable);
        });
    }
    static create(name, content_ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db
                .insert(session_1.sessionTable)
                .values({ name, content_ids })
                .returning();
            return result[0];
        });
    }
    static update(id, name, content_ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db
                .update(session_1.sessionTable)
                .set({ name, content_ids })
                .where((0, drizzle_orm_1.eq)(session_1.sessionTable.id, id))
                .returning();
            return result[0];
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db
                .delete(session_1.sessionTable)
                .where((0, drizzle_orm_1.eq)(session_1.sessionTable.id, id))
                .returning();
            return result[0];
        });
    }
}
exports.SessionRepository = SessionRepository;
