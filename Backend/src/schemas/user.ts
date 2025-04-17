import { pgTable, serial, varchar, date, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  firstname: varchar("firstname", { length: 255 }).notNull(),
  lastname: varchar("lastname", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password").notNull(),
  dateOfBirth: date("date_of_birth"),
  address: varchar("address", { length: 255 }),
  country: varchar("country", { length: 255 }),
  zipcode: varchar("zipcode", { length: 10 }),
  phone: varchar("phone", { length: 20 }),
  createdAt: date("created_at").defaultNow().notNull(),
  updatedAt: date("updated_at").defaultNow().notNull(),
}, (table) => [
  unique("users_email_unique").on(table.email),
]);
