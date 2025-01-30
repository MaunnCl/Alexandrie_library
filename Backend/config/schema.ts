import { uuid, varchar, pgTable, date } from "drizzle-orm/pg-core";

// Defining user table
export const userTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().unique(),
    name: varchar("name").notNull(),
    lastName: varchar("lastName").notNull(),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: varchar("password").notNull(),
    phone: varchar("phone").notNull(),
    city: varchar("city").notNull(),
    zipcode: varchar("zipcode").notNull(),
    subscription_id: uuid("subscription_id"),
    createdAt: date("createdAt").notNull().defaultNow(),
    updatedAt: date("updatedAt").notNull().defaultNow()
});

// Defining subscription table