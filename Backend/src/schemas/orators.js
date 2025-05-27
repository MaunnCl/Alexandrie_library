"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oratorsTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.oratorsTable = (0, pg_core_1.pgTable)("orators", {
    id: (0, pg_core_1.serial)("id").primaryKey().unique().notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    picture: (0, pg_core_1.varchar)("picture", { length: 512 }),
    content_ids: (0, pg_core_1.jsonb)("content_ids").$type().default([]),
    country: (0, pg_core_1.varchar)("country", { length: 255 }).notNull(),
    city: (0, pg_core_1.varchar)("city", { length: 255 }).notNull(),
});
