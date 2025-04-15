import { pgTable, serial, varchar, jsonb } from "drizzle-orm/pg-core";

export const sessionTable = pgTable("session", {
  id: serial("id").primaryKey().unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  content_ids: jsonb("content_ids").$type<number[]>().default([]),
});
