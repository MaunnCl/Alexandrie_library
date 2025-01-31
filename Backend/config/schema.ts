import { uuid, varchar, pgTable, date, integer, serial } from "drizzle-orm/pg-core";

// Defining user table
export const userTable = pgTable("users", {
    id: serial("id").primaryKey().unique(),
    firstname: varchar("firstname", {length: 255}),
    lastname: varchar("lastname", {length: 255}),
    username: varchar("username", {length: 255}).notNull().unique(),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: varchar("password").notNull(),
    phone: varchar("phone"),
    city: varchar("city"),
    zipcode: varchar("zipcode"),
    subscription_id: uuid("subscription_id"),
    createdAt: date("createdAt").notNull().defaultNow(),
    updatedAt: date("updatedAt").notNull().defaultNow()
});

// Defining subscription table