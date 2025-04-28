"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleList = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.roleList = (0, pg_core_1.pgTable)("role_list", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom().notNull(),
    role_name: (0, pg_core_1.varchar)("role_name", { length: 255 }).notNull(),
    description: (0, pg_core_1.varchar)("description", { length: 255 }).notNull(),
});
