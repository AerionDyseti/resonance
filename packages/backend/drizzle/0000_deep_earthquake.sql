CREATE TABLE `entities` (
	`id` text PRIMARY KEY NOT NULL,
	`world_id` text NOT NULL,
	`template_id` text,
	`name` text NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`metadata` blob,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `entities_world_id_idx` ON `entities` (`world_id`);--> statement-breakpoint
CREATE INDEX `entities_template_id_idx` ON `entities` (`template_id`);--> statement-breakpoint
CREATE INDEX `entities_type_idx` ON `entities` (`type`);--> statement-breakpoint
CREATE TABLE `properties` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_id` text NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL,
	`type` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `properties_entity_id_idx` ON `properties` (`entity_id`);--> statement-breakpoint
CREATE TABLE `relationships` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`target_id` text NOT NULL,
	`type` text NOT NULL,
	`label` text,
	`metadata` blob,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `relationships_source_id_idx` ON `relationships` (`source_id`);--> statement-breakpoint
CREATE INDEX `relationships_target_id_idx` ON `relationships` (`target_id`);--> statement-breakpoint
CREATE INDEX `relationships_type_idx` ON `relationships` (`type`);--> statement-breakpoint
CREATE TABLE `templates` (
	`id` text PRIMARY KEY NOT NULL,
	`world_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`schema` blob NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `templates_world_id_idx` ON `templates` (`world_id`);--> statement-breakpoint
CREATE INDEX `templates_name_idx` ON `templates` (`name`);--> statement-breakpoint
CREATE TABLE `worlds` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `worlds_name_idx` ON `worlds` (`name`);