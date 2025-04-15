import { pgTable, unique, serial, varchar, jsonb, foreignKey, uuid, integer, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const orators = pgTable("orators", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	picture: varchar({ length: 512 }),
	contentIds: jsonb("content_ids").default([]),
	country: varchar({ length: 255 }).notNull(),
	city: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("orators_id_unique").on(table.id),
]);

export const subscriptions = pgTable("subscriptions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: serial("user_id").notNull(),
	status: varchar({ length: 50 }).notNull(),
	plan: varchar({ length: 100 }).notNull(),
	price: integer().notNull(),
	paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
	nextBillingDate: date("next_billing_date"),
	subscriptionStarted: date("subscription_started").notNull(),
	subscriptionEnded: date("subscription_ended"),
	createdAt: date().defaultNow().notNull(),
	updatedAt: date().defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "subscriptions_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const content = pgTable("content", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }),
	url: varchar({ length: 255 }),
	oratorId: integer("orator_id"),
}, (table) => [
	unique("content_id_unique").on(table.id),
]);

export const usersProfiles = pgTable("usersProfiles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: serial("user_id").notNull(),
	profilePicture: varchar("profile_picture", { length: 255 }),
	bio: varchar({ length: 500 }).notNull(),
	preferences: varchar({ length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "usersProfiles_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const usersRoles = pgTable("usersRoles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: serial("user_id").notNull(),
	roleId: uuid("role_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "usersRoles_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roleList.id],
			name: "usersRoles_role_id_roleList_id_fk"
		}).onDelete("cascade"),
]);

export const paymentHistory = pgTable("payment_history", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	subscriptionId: uuid("subscription_id").notNull(),
	amount: integer().notNull(),
	paymentDate: date("payment_date").notNull(),
	paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
	status: varchar({ length: 50 }).notNull(),
	createdAt: date().defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.subscriptionId],
			foreignColumns: [subscriptions.id],
			name: "payment_history_subscription_id_subscriptions_id_fk"
		}).onDelete("cascade"),
]);

export const roleList = pgTable("roleList", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	roleName: varchar("role_name", { length: 255 }).notNull(),
	description: varchar({ length: 255 }).notNull(),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	firstname: varchar({ length: 255 }).notNull(),
	lastname: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar().notNull(),
	dateOfBirth: date("date_of_birth"),
	address: varchar({ length: 255 }),
	country: varchar({ length: 255 }),
	zipcode: varchar({ length: 10 }),
	createdAt: date().defaultNow().notNull(),
	updatedAt: date().defaultNow().notNull(),
	phone: varchar({ length: 20 }),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const congress = pgTable("congress", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	sessionIds: jsonb("session_ids").default([]),
	picture: varchar({ length: 512 }),
	date: date().notNull(),
	city: varchar({ length: 255 }).notNull(),
	key: varchar({ length: 255 }).notNull(),
});

export const session = pgTable("session", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	contentIds: jsonb("content_ids").default([]),
});
