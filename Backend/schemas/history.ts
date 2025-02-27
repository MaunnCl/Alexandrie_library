import { pgTable, serial, integer, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { contentTable } from "./content";

export const historyTable = pgTable("history", {
    id: serial("id").primaryKey().unique().notNull(),
    user_id: integer("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    content_id: integer("content_id").notNull().references(() => contentTable.id, { onDelete: "cascade" }),
    watched_at: timestamp("watched_at").defaultNow(),
});
