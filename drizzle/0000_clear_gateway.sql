CREATE TABLE `agent_skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` int NOT NULL,
	`skillName` varchar(100) NOT NULL,
	`enabled` boolean DEFAULT true,
	`config` json,
	`lastUsedAt` timestamp,
	`usageCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agent_skills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`specialization` enum('content','traffic','research','analytics','outreach','funnel') NOT NULL,
	`description` text,
	`systemPrompt` text NOT NULL,
	`status` enum('active','inactive','training') NOT NULL DEFAULT 'active',
	`reputationScore` decimal(5,2) DEFAULT '50.00',
	`completionRate` decimal(5,2) DEFAULT '0.00',
	`successRate` decimal(5,2) DEFAULT '0.00',
	`verificationPassRate` decimal(5,2) DEFAULT '0.00',
	`totalTasksCompleted` int DEFAULT 0,
	`totalCreditsEarned` decimal(12,2) DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaign_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`date` date NOT NULL,
	`leadsGenerated` int DEFAULT 0,
	`leadsQualified` int DEFAULT 0,
	`emailsSent` int DEFAULT 0,
	`emailsOpened` int DEFAULT 0,
	`emailsClicked` int DEFAULT 0,
	`conversions` int DEFAULT 0,
	`revenue` decimal(12,2) DEFAULT '0.00',
	`costPerLead` decimal(10,2) DEFAULT '0.00',
	`costPerConversion` decimal(10,2) DEFAULT '0.00',
	`roi` decimal(8,2) DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaign_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('lead_gen','email_sequence','content_series','social_blitz','funnel_optimization') NOT NULL,
	`description` text,
	`status` enum('draft','active','paused','completed','archived') NOT NULL DEFAULT 'draft',
	`startDate` timestamp,
	`endDate` timestamp,
	`budget` decimal(12,2) DEFAULT '0.00',
	`leadCount` int DEFAULT 0,
	`conversionGoal` int DEFAULT 0,
	`assignedAgents` json,
	`results` json,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`firstName` varchar(100),
	`lastName` varchar(100),
	`company` varchar(255),
	`source` varchar(100),
	`status` enum('new','contacted','engaged','qualified','converted','lost') NOT NULL DEFAULT 'new',
	`campaignId` int,
	`score` int DEFAULT 0,
	`notes` text,
	`lastContactedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `leads_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `marketing_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`leadId` int,
	`agentId` int NOT NULL,
	`taskType` varchar(100) NOT NULL,
	`description` text,
	`status` enum('pending','in_progress','completed','failed','verified') NOT NULL DEFAULT 'pending',
	`input` json,
	`output` json,
	`reasoning` text,
	`creditsAllocated` decimal(12,2) DEFAULT '0.00',
	`creditsUsed` decimal(12,2) DEFAULT '0.00',
	`verificationStatus` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`verificationNotes` text,
	`executedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marketing_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skill_executions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` int NOT NULL,
	`skillName` varchar(100) NOT NULL,
	`status` enum('pending','executing','completed','failed') NOT NULL DEFAULT 'pending',
	`input` json,
	`output` json,
	`error` text,
	`executedAt` timestamp,
	`completedAt` timestamp,
	`creditsUsed` decimal(12,2) DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skill_executions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
