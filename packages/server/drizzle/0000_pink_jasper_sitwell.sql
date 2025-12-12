-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "entities" (
	"id" text PRIMARY KEY NOT NULL,
	"world_id" text NOT NULL,
	"definition_id" text NOT NULL,
	"name" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"properties" text DEFAULT '{}' NOT NULL,
	"embedding" vector(1536),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entity_definition_property_definitions" (
	"entity_definition_id" text NOT NULL,
	"property_definition_id" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "entity_definition_property_definitions_entity_definition_id_property_definition_id_pk" PRIMARY KEY("entity_definition_id","property_definition_id")
);
--> statement-breakpoint
CREATE TABLE "entity_definitions" (
	"id" text PRIMARY KEY NOT NULL,
	"world_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_definitions" (
	"id" text PRIMARY KEY NOT NULL,
	"world_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"required" boolean DEFAULT false NOT NULL,
	"default_value" text,
	"constraints" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "relationships" (
	"id" text PRIMARY KEY NOT NULL,
	"world_id" text NOT NULL,
	"from_entity_id" text NOT NULL,
	"to_entity_id" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "worlds" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "entities_world_id_idx" ON "entities" USING btree ("world_id");--> statement-breakpoint
CREATE INDEX "entities_definition_id_idx" ON "entities" USING btree ("definition_id");--> statement-breakpoint
CREATE INDEX "entities_name_idx" ON "entities" USING btree ("name");--> statement-breakpoint
CREATE INDEX "edpd_entity_definition_id_idx" ON "entity_definition_property_definitions" USING btree ("entity_definition_id");--> statement-breakpoint
CREATE INDEX "edpd_property_definition_id_idx" ON "entity_definition_property_definitions" USING btree ("property_definition_id");--> statement-breakpoint
CREATE INDEX "entity_definitions_world_id_idx" ON "entity_definitions" USING btree ("world_id");--> statement-breakpoint
CREATE INDEX "entity_definitions_name_idx" ON "entity_definitions" USING btree ("name");--> statement-breakpoint
CREATE INDEX "property_definitions_world_id_idx" ON "property_definitions" USING btree ("world_id");--> statement-breakpoint
CREATE INDEX "property_definitions_name_idx" ON "property_definitions" USING btree ("name");--> statement-breakpoint
CREATE INDEX "property_definitions_type_idx" ON "property_definitions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "relationships_world_id_idx" ON "relationships" USING btree ("world_id");--> statement-breakpoint
CREATE INDEX "relationships_from_entity_id_idx" ON "relationships" USING btree ("from_entity_id");--> statement-breakpoint
CREATE INDEX "relationships_to_entity_id_idx" ON "relationships" USING btree ("to_entity_id");--> statement-breakpoint
CREATE INDEX "relationships_type_idx" ON "relationships" USING btree ("type");--> statement-breakpoint
CREATE INDEX "worlds_name_idx" ON "worlds" USING btree ("name");