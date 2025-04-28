"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.contentTable = (0, pg_core_1.pgTable)("content", {
    id: (0, pg_core_1.serial)("id").primaryKey().unique().notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    orator_id: (0, pg_core_1.integer)("orator_id"),
    description: (0, pg_core_1.varchar)("description", { length: 255 }),
    url: (0, pg_core_1.text)("url"),
    timeStamp: (0, pg_core_1.text)("timeStamp")
});
