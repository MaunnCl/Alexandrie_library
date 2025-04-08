import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { contentTable } from "./content";

export const categoriesTable = pgTable("categories", {
    id: serial("id").primaryKey().unique().notNull(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    description: varchar("description", { length: 255 }).notNull(),
    picture_orator: varchar("picture_orator", { length: 255 }).notNull(),
    orator_image_url: varchar("orator_image_url", { length: 512 }).notNull(),
});

export const contentCategoryTable = pgTable("content_category", {
    content_id: integer("content_id")
        .notNull()
        .references(() => contentTable.id, { onDelete: "cascade" }),
        
    category_id: integer("category_id")
        .notNull()
        .references(() => categoriesTable.id, { onDelete: "cascade" }),
});
