import { pgTable, uuid, varchar, date, integer, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { paymentHistoryTable } from "./payment";
import { userTable } from "./user";

export const subscriptionTable = pgTable("subscriptions", {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: serial("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 50 }).notNull(),
    plan: varchar("plan", { length: 100 }).notNull(),
    price: integer("price").notNull(),
    payment_method: varchar("payment_method", { length: 50 }).notNull(),
    next_billing_date: date("next_billing_date"),
    subscription_started: date("subscription_started").notNull(),
    subscription_ended: date("subscription_ended"),
    createdAt: date("createdAt").notNull().defaultNow(),
    updatedAt: date("updatedAt").notNull().defaultNow()
});

export const subscriptionRelations = relations(subscriptionTable, ({ one, many }) => ({
    payments: many(paymentHistoryTable),
    user: one(userTable, {
        fields: [subscriptionTable.user_id],
        references: [userTable.id]
    })
}))
