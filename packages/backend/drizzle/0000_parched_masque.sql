CREATE TABLE `entities` (
	`id` text PRIMARY KEY NOT NULL,
	`world_id` text NOT NULL,
	`definition_id` text NOT NULL,
	`name` text NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`properties` text DEFAULT '{}' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `entities_world_id_idx` ON `entities` (`world_id`);--> statement-breakpoint
CREATE INDEX `entities_definition_id_idx` ON `entities` (`definition_id`);--> statement-breakpoint
CREATE INDEX `entities_name_idx` ON `entities` (`name`);--> statement-breakpoint
CREATE TABLE `entity_definition_property_definitions` (
	`entity_definition_id` text NOT NULL,
	`property_definition_id` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`entity_definition_id`, `property_definition_id`)
);
--> statement-breakpoint
CREATE INDEX `edpd_entity_definition_id_idx` ON `entity_definition_property_definitions` (`entity_definition_id`);--> statement-breakpoint
CREATE INDEX `edpd_property_definition_id_idx` ON `entity_definition_property_definitions` (`property_definition_id`);--> statement-breakpoint
CREATE TABLE `entity_definitions` (
	`id` text PRIMARY KEY NOT NULL,
	`world_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `entity_definitions_world_id_idx` ON `entity_definitions` (`world_id`);--> statement-breakpoint
CREATE INDEX `entity_definitions_name_idx` ON `entity_definitions` (`name`);--> statement-breakpoint
CREATE TABLE `property_definitions` (
	`id` text PRIMARY KEY NOT NULL,
	`world_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`required` integer DEFAULT false NOT NULL,
	`default_value` text,
	`constraints` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `property_definitions_world_id_idx` ON `property_definitions` (`world_id`);--> statement-breakpoint
CREATE INDEX `property_definitions_name_idx` ON `property_definitions` (`name`);--> statement-breakpoint
CREATE INDEX `property_definitions_type_idx` ON `property_definitions` (`type`);--> statement-breakpoint
CREATE TABLE `relationships` (
	`id` text PRIMARY KEY NOT NULL,
	`world_id` text NOT NULL,
	`from_entity_id` text NOT NULL,
	`to_entity_id` text NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`metadata` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `relationships_world_id_idx` ON `relationships` (`world_id`);--> statement-breakpoint
CREATE INDEX `relationships_from_entity_id_idx` ON `relationships` (`from_entity_id`);--> statement-breakpoint
CREATE INDEX `relationships_to_entity_id_idx` ON `relationships` (`to_entity_id`);--> statement-breakpoint
CREATE INDEX `relationships_type_idx` ON `relationships` (`type`);--> statement-breakpoint
CREATE TABLE `worlds` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `worlds_name_idx` ON `worlds` (`name`);