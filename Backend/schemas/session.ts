import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";

export const sessionTable = pgTable("session", {
  id: serial("id").primaryKey().unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  content_ids: integer("content_ids").array().default([]),
});
