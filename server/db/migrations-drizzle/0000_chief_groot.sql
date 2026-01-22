CREATE TABLE "emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender" varchar(50) NOT NULL,
	"recipient" varchar(50) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"content" varchar(5000) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(20) NOT NULL,
	"last_name" varchar(20) NOT NULL,
	"email" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	"image" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_sender_users_email_fk" FOREIGN KEY ("sender") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_recipient_users_email_fk" FOREIGN KEY ("recipient") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;