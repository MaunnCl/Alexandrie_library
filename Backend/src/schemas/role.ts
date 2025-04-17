import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const roleList = pgTable("role_list", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  role_name: varchar("role_name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
});
