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
exports.ContentRepository = void 0;
const database_1 = require("../../config/database");
const content_1 = require("../schemas/content");
const drizzle_orm_1 = require("drizzle-orm");
class ContentRepository {
    static findByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db
                .select()
                .from(content_1.contentTable)
                .where((0, drizzle_orm_1.eq)(content_1.contentTable.title, title));
            return result[0];
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.db.select().from(content_1.contentTable);
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db
                .select()
                .from(content_1.contentTable)
                .where((0, drizzle_orm_1.eq)(content_1.contentTable.id, id));
            return result[0];
        });
    }
    static create(title, orator_id, description, url, timeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db
                .insert(content_1.contentTable)
                .values({ title, orator_id, description, url, timeStamp })
                .returning();
            return result[0];
        });
    }
    static update(id, title, orator_id, description, url, timeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db
                .update(content_1.contentTable)
                .set({ title, orator_id, description, url, timeStamp })
                .where((0, drizzle_orm_1.eq)(content_1.contentTable.id, id))
                .returning();
            return result[0];
        });
    }
    static updateOrator(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db
                .update(content_1.contentTable)
                .set(data)
                .where((0, drizzle_orm_1.eq)(content_1.contentTable.id, id))
                .returning();
            return result[0];
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db
                .delete(content_1.contentTable)
                .where((0, drizzle_orm_1.eq)(content_1.contentTable.id, id))
                .returning();
            return result[0];
        });
    }
    static findByOratorId(orator_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.db
                .select()
                .from(content_1.contentTable)
                .where((0, drizzle_orm_1.eq)(content_1.contentTable.orator_id, orator_id));
        });
    }
}
exports.ContentRepository = ContentRepository;
