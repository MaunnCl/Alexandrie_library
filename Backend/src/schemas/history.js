"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHistory = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = require("./user");
const content_1 = require("./content");
exports.userHistory = (0, pg_core_1.pgTable)("user_history", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").references(() => user_1.users.id, { onDelete: "cascade" }).notNull(),
    contentId: (0, pg_core_1.integer)("content_id").references(() => content_1.contentTable.id, { onDelete: "cascade" }).notNull(),
    viewedAt: (0, pg_core_1.timestamp)("viewed_at", { withTimezone: false }).defaultNow().notNull(),
    timeStamp: (0, pg_core_1.text)("timeStamp").notNull(),
}, (table) => {
    return {
        uniqueView: (0, pg_core_1.unique)().on(table.userId, table.contentId)
    };
});
