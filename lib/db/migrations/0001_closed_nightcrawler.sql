CREATE TYPE "public"."service_urgency" AS ENUM('asap', 'fast', 'no_rush');--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "urgency" "service_urgency" DEFAULT 'no_rush' NOT NULL;