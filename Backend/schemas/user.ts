import { relations } from "drizzle-orm";
import { subscriptionTable } from "./subscription";
import { pgTable, serial, varchar, date, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
    id: serial("id").primaryKey().unique().notNull(),
    firstname: varchar("firstname", { length: 255 }).notNull(),
    lastname: varchar("lastname", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password").notNull(),
    date_of_birth: date("date_of_birth"),
    address: varchar("address", { length: 255 }),
    country: varchar("country", { length: 255 }),
    zipcode: varchar("zipcode", { length: 10 }),
    createdAt: date("createdAt").notNull().defaultNow(),
    updatedAt: date("updatedAt").notNull().defaultNow()
});

export const userRelations = relations(userTable, ({ one }) => ({
    subscription: one(subscriptionTable, {
        fields: [userTable.id],
        references: [subscriptionTable.user_id]
    }),
}))
