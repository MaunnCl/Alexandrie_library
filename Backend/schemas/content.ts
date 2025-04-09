import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const contentTable = pgTable("content", {
  id: serial("id").primaryKey().unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  url: varchar("url", { length: 255 })
});