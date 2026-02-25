CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"campus" text NOT NULL,
	"category" text NOT NULL,
	"start_date_time" timestamp NOT NULL,
	"end_date_time" timestamp NOT NULL,
	"cost" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "events_published_start_idx" ON "events" USING btree ("is_published","start_date_time");--> statement-breakpoint
CREATE INDEX "events_campus_idx" ON "events" USING btree ("campus");--> statement-breakpoint
CREATE INDEX "events_category_idx" ON "events" USING btree ("category");