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
exports.CongressRepository = void 0;
const database_1 = require("../../config/database");
const congress_1 = require("../schemas/congress");
const drizzle_orm_1 = require("drizzle-orm");
class CongressRepository {
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db
                .select()
                .from(congress_1.congressTable)
                .where((0, drizzle_orm_1.eq)(congress_1.congressTable.id, id));
            return result[0];
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.db.select().from(congress_1.congressTable);
        });
    }
    static create(name, key, session_ids, picture, date, city) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db
                .insert(congress_1.congressTable)
                .values({ name, key, session_ids, picture, date, city })
                .returning();
            return result[0];
        });
    }
    static update(id, name, key, session_ids, picture, date, city) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db
                .update(congress_1.congressTable)
                .set({ name, key, session_ids, picture, date, city })
                .where((0, drizzle_orm_1.eq)(congress_1.congressTable.id, id))
                .returning();
            return result[0];
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db
                .delete(congress_1.congressTable)
                .where((0, drizzle_orm_1.eq)(congress_1.congressTable.id, id))
                .returning();
            return result[0];
        });
    }
}
exports.CongressRepository = CongressRepository;
