"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.sessionTable = (0, pg_core_1.pgTable)("session", {
    id: (0, pg_core_1.serial)("id").primaryKey().unique().notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    content_ids: (0, pg_core_1.jsonb)("content_ids").$type().default([]),
});
