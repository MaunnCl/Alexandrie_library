"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersProfiles = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = require("./user");
exports.usersProfiles = (0, pg_core_1.pgTable)("users_profiles", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom().notNull(),
    user_id: (0, pg_core_1.integer)("user_id").notNull().references(() => user_1.users.id, {
        onDelete: "cascade",
    }),
    profilePicture: (0, pg_core_1.varchar)("profile_picture", { length: 255 }),
    bio: (0, pg_core_1.varchar)("bio", { length: 500 }).notNull(),
    preferences: (0, pg_core_1.varchar)("preferences", { length: 255 }),
});
