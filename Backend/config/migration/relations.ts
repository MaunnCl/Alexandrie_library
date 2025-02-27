import { relations } from "drizzle-orm/relations";
import { users, subscriptions, paymentHistory, usersProfiles, usersRoles, roleList } from "./schema";

export const subscriptionsRelations = relations(subscriptions, ({one, many}) => ({
	user: one(users, {
		fields: [subscriptions.userId],
		references: [users.id]
	}),
	paymentHistories: many(paymentHistory),
}));

export const usersRelations = relations(users, ({many}) => ({
	subscriptions: many(subscriptions),
	usersProfiles: many(usersProfiles),
	usersRoles: many(usersRoles),
}));

export const paymentHistoryRelations = relations(paymentHistory, ({one}) => ({
	subscription: one(subscriptions, {
		fields: [paymentHistory.subscriptionId],
		references: [subscriptions.id]
	}),
}));

export const usersProfilesRelations = relations(usersProfiles, ({one}) => ({
	user: one(users, {
		fields: [usersProfiles.userId],
		references: [users.id]
	}),
}));

export const usersRolesRelations = relations(usersRoles, ({one}) => ({
	user: one(users, {
		fields: [usersRoles.userId],
		references: [users.id]
	}),
	roleList: one(roleList, {
		fields: [usersRoles.roleId],
		references: [roleList.id]
	}),
}));

export const roleListRelations = relations(roleList, ({many}) => ({
	usersRoles: many(usersRoles),
}));