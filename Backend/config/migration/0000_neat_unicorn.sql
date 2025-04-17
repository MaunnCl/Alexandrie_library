CREATE TABLE "congress" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"key" varchar(255) NOT NULL,
	"session_ids" jsonb DEFAULT '[]'::jsonb,
	"picture" varchar(512),
	"date" date NOT NULL,
	"city" varchar(255) NOT NULL,
	CONSTRAINT "congress_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "content" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"orator_id" integer,
	"description" varchar(255),
	"url" text,
	CONSTRAINT "content_id_unique" UNIQUE("id")
);
--> statement-breakpoint
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
CREATE TABLE "users_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"profile_picture" varchar(255),
	"bio" varchar(500) NOT NULL,
	"preferences" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "role_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"content_ids" jsonb DEFAULT '[]'::jsonb,
	CONSTRAINT "session_id_unique" UNIQUE("id")
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
	"phone" varchar(20),
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"role_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users_profiles" ADD CONSTRAINT "users_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_role_id_role_list_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role_list"("id") ON DELETE cascade ON UPDATE no action;