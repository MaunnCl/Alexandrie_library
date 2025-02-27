import { pgTable, serial, varchar, date, timestamp, integer, uuid } from "drizzle-orm/pg-core";

export const contentTable = pgTable("content", {
    id: serial("id").primaryKey().unique().notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 }).notNull().unique(),
    url: varchar("url").notNull(),
    thumbnail_url: varchar("thumbnail_url").notNull(),
    duration: integer("duration").notNull(),
    release_date: date("release_date").notNull().defaultNow(),
    createdAt: date("createdAt").notNull().defaultNow(),
    updatedAt: date("updatedAt").notNull().defaultNow()
});