import { pgTable, serial, integer, timestamp, unique, text } from "drizzle-orm/pg-core";
import { users } from "./user";
import { contentTable } from "./content";

export const userHistory = pgTable("user_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  contentId: integer("content_id").references(() => contentTable.id, { onDelete: "cascade" }).notNull(),
  viewedAt: timestamp("viewed_at", { withTimezone: false }).defaultNow().notNull(),
  timeStamp: text("timeStamp").notNull(),
},
(table) => {
  return {
    uniqueView: unique().on(table.userId, table.contentId)
  };
});