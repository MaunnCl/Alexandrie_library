import { pgTable, serial, varchar, date } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
    id: serial("id").primaryKey().unique(),
    firstname: varchar("firstname", { length: 255 }),
    lastname: varchar("lastname", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password").notNull(),
    date_of_birth: date("date_of_birth"),
    address: varchar("address", { length: 255 }),
    country: varchar("country", { length: 255 }),
    zipcode: varchar("zipcode", { length: 10 }),
    createdAt: date("createdAt").notNull().defaultNow(),
    updatedAt: date("updatedAt").notNull().defaultNow()
});
