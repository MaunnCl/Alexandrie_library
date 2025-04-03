import { pgTable, serial, varchar, date, timestamp, integer, uuid } from "drizzle-orm/pg-core";

export const contentTable = pgTable("content", {
    id: serial("id").primaryKey().unique().notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    folder: varchar("folder", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    type: varchar("type", { length: 255 }),
    url: varchar("url").notNull(),
    orator_image_url: varchar("orator_image_url", { length: 512 }).notNull(),
    video_thumbnail_url: varchar("video_thumbnail_url", { length: 512 }).notNull(),
    duration: integer("duration"),
    release_date: date("release_date").defaultNow(),
    createdAt: date("createdAt").defaultNow(),
    updatedAt: date("updatedAt").defaultNow()
});