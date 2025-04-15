-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "orators" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"picture" varchar(512),
	"content_ids" jsonb DEFAULT '[]'::jsonb,
	"country" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	CONSTRAINT "orators_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" serial NOT NULL,
	"status" varchar(50) NOT NULL,
	"plan" varchar(100) NOT NULL,
	"price" integer NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"next_billing_date" date,
	"subscription_started" date NOT NULL,
	"subscription_ended" date,
	"createdAt" date DEFAULT now() NOT NULL,
	"updatedAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255),
	"url" varchar(255),
	"orator_id" integer,
	CONSTRAINT "content_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "usersProfiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" serial NOT NULL,
	"profile_picture" varchar(255),
	"bio" varchar(500) NOT NULL,
	"preferences" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "usersRoles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" serial NOT NULL,
	"role_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"payment_date" date NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roleList" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstname" varchar(255) NOT NULL,
	"lastname" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar NOT NULL,
	"date_of_birth" date,
	"address" varchar(255),
	"country" varchar(255),
	"zipcode" varchar(10),
	"createdAt" date DEFAULT now() NOT NULL,
	"updatedAt" date DEFAULT now() NOT NULL,
	"phone" varchar(20),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "congress" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"session_ids" jsonb DEFAULT '[]'::jsonb,
	"picture" varchar(512),
	"date" date NOT NULL,
	"city" varchar(255) NOT NULL,
	"key" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"content_ids" jsonb DEFAULT '[]'::jsonb
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersProfiles" ADD CONSTRAINT "usersProfiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersRoles" ADD CONSTRAINT "usersRoles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersRoles" ADD CONSTRAINT "usersRoles_role_id_roleList_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roleList"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_history" ADD CONSTRAINT "payment_history_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;
*/