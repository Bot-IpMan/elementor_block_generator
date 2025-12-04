CREATE TABLE `block_configs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`templateType` enum('pricing_card','feature_list','hero_section','testimonial','cta_section','team_member','service_card','custom') NOT NULL DEFAULT 'custom',
	`config` json NOT NULL,
	`generatedHtml` text,
	`generatedCss` text,
	`isPublic` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `block_configs_id` PRIMARY KEY(`id`)
);
