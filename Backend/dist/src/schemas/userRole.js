"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoles = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = require("./user");
const role_1 = require("./role");
exports.usersRoles = (0, pg_core_1.pgTable)("users_roles", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom().notNull(),
    user_id: (0, pg_core_1.integer)("user_id").notNull().references(() => user_1.users.id, {
        onDelete: "cascade",
    }),
    role_id: (0, pg_core_1.uuid)("role_id").notNull().references(() => role_1.roleList.id, {
        onDelete: "cascade",
    }),
});
