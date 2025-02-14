import { relations } from "drizzle-orm";
import { subscriptionTable } from "./subscription";
import { pgTable, serial, varchar, date, timestamp, integer, uuid } from "drizzle-orm/pg-core";

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

export const userProfile = pgTable("usersProfiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: integer("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    profile_picture: varchar("profile_picture", {length: 255}).notNull(),
    bio: varchar("bio", {length: 500}).notNull(),
    preferences: varchar("preferences", {length: 255}).notNull()
})

export const roleList = pgTable("roleList", {
    id: uuid("id").primaryKey().defaultRandom(),
    role_name: varchar("role_name", {length: 255}).notNull(),
    description: varchar("description", {length: 255}).notNull()
})

export const usersRoles = pgTable("usersRoles", {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: integer("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    role_id: integer("role_id").notNull().references(() => roleList.id, { onDelete: "cascade" }),
})