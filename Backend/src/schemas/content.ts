import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";

export const contentTable = pgTable("content", {
  id: serial("id").primaryKey().unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  orator_id: integer("orator_id"),
  description: varchar("description", { length: 255 }),
  url: varchar("url", { length: 255 })
});
