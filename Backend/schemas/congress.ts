import { pgTable, serial, varchar, date, integer, jsonb } from "drizzle-orm/pg-core";

export const congressTable = pgTable("congress", {
  id: serial("id").primaryKey().unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  session_ids: jsonb("session_ids").default('[]'),
  picture: varchar("picture", { length: 512 }),
  date: date("date").notNull(),
  city: varchar("city", { length: 255 }).notNull(),
});
