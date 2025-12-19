CREATE TABLE "entities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"world_id" uuid NOT NULL,
	"definition_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"aliases" text[] DEFAULT '{}',
	"summary" text,
	"body" text DEFAULT '' NOT NULL,
	"image_url" text,
	"properties" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tag_ids" uuid[] DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entity_definitions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"world_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar(50),
	"template_ids" uuid[] DEFAULT '{}',
	"property_definition_ids" uuid[] DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_definitions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"world_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"description" text,
	"required" boolean DEFAULT false NOT NULL,
	"default_value" jsonb,
	"constraints" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "relationship_definitions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"world_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"inverse_name" varchar(255),
	"is_symmetric" boolean DEFAULT false NOT NULL,
	"source_entity_definition_id" uuid,
	"target_entity_definition_id" uuid,
	"property_definition_ids" uuid[] DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "relationships" (
	"id" uuid PRIMARY KEY NOT NULL,
	"world_id" uuid NOT NULL,
	"definition_id" uuid NOT NULL,
	"source_entity_id" uuid NOT NULL,
	"target_entity_id" uuid NOT NULL,
	"properties" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY NOT NULL,
	"world_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"color" varchar(7),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "worlds" (
	"id" uuid PRIMARY KEY NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entities" ADD CONSTRAINT "entities_world_id_worlds_id_fk" FOREIGN KEY ("world_id") REFERENCES "public"."worlds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entities" ADD CONSTRAINT "entities_definition_id_entity_definitions_id_fk" FOREIGN KEY ("definition_id") REFERENCES "public"."entity_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entity_definitions" ADD CONSTRAINT "entity_definitions_world_id_worlds_id_fk" FOREIGN KEY ("world_id") REFERENCES "public"."worlds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_definitions" ADD CONSTRAINT "property_definitions_world_id_worlds_id_fk" FOREIGN KEY ("world_id") REFERENCES "public"."worlds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationship_definitions" ADD CONSTRAINT "relationship_definitions_world_id_worlds_id_fk" FOREIGN KEY ("world_id") REFERENCES "public"."worlds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationship_definitions" ADD CONSTRAINT "relationship_definitions_source_entity_definition_id_entity_definitions_id_fk" FOREIGN KEY ("source_entity_definition_id") REFERENCES "public"."entity_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationship_definitions" ADD CONSTRAINT "relationship_definitions_target_entity_definition_id_entity_definitions_id_fk" FOREIGN KEY ("target_entity_definition_id") REFERENCES "public"."entity_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_world_id_worlds_id_fk" FOREIGN KEY ("world_id") REFERENCES "public"."worlds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_definition_id_relationship_definitions_id_fk" FOREIGN KEY ("definition_id") REFERENCES "public"."relationship_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_source_entity_id_entities_id_fk" FOREIGN KEY ("source_entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_target_entity_id_entities_id_fk" FOREIGN KEY ("target_entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_world_id_worlds_id_fk" FOREIGN KEY ("world_id") REFERENCES "public"."worlds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "worlds" ADD CONSTRAINT "worlds_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "entities_world_slug_idx" ON "entities" USING btree ("world_id","slug");--> statement-breakpoint
CREATE INDEX "relationships_source_idx" ON "relationships" USING btree ("source_entity_id");--> statement-breakpoint
CREATE INDEX "relationships_target_idx" ON "relationships" USING btree ("target_entity_id");--> statement-breakpoint
CREATE INDEX "relationships_world_idx" ON "relationships" USING btree ("world_id");