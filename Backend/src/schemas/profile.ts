import { pgTable, uuid, serial, varchar, integer } from "drizzle-orm/pg-core";
import { users } from "./user";

export const usersProfiles = pgTable("users_profiles", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  user_id: integer("user_id").notNull().references(() => users.id, {
    onDelete: "cascade",
  }),
  profilePicture: varchar("profile_picture", { length: 255 }),
  bio: varchar("bio", { length: 500 }).notNull(),
  preferences: varchar("preferences", { length: 255 }),
});
