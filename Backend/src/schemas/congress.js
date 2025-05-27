"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.congressTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.congressTable = (0, pg_core_1.pgTable)("congress", {
    id: (0, pg_core_1.serial)("id").primaryKey().unique().notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    key: (0, pg_core_1.varchar)("key", { length: 255 }).notNull(),
    session_ids: (0, pg_core_1.jsonb)("session_ids").$type().default([]),
    picture: (0, pg_core_1.varchar)("picture", { length: 512 }),
    date: (0, pg_core_1.date)("date").notNull(),
    city: (0, pg_core_1.varchar)("city", { length: 255 }).notNull(),
});
