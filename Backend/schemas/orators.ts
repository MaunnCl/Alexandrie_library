import { pgTable, serial, varchar, integer, jsonb } from "drizzle-orm/pg-core";

export const oratorsTable = pgTable("orators", {
  id: serial("id").primaryKey().unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  picture: varchar("picture", { length: 512 }),
  content_ids: jsonb("content_ids").default('[]'),
  country: varchar("country", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
});