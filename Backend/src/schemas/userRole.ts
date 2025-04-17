import { pgTable, uuid, integer } from "drizzle-orm/pg-core";
import { users } from "./user";
import { roleList } from "./role";

export const usersRoles = pgTable("users_roles", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  user_id: integer("user_id").notNull().references(() => users.id, {
    onDelete: "cascade",
  }),
  role_id: uuid("role_id").notNull().references(() => roleList.id, {
    onDelete: "cascade",
  }),
});
