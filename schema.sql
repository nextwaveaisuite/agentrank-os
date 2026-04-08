-- AgentRank OS Database Schema
-- Run this in Supabase SQL Editor

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  "businessName" VARCHAR(255),
  "contactName" VARCHAR(255),
  email VARCHAR(320),
  phone VARCHAR(64),
  website VARCHAR(512),
  "linkedinUrl" VARCHAR(512),
  industry VARCHAR(128),
  location VARCHAR(255),
  "companySize" VARCHAR(64),
  "estimatedRevenue" VARCHAR(64),
  status VARCHAR(32) DEFAULT 'new' NOT NULL,
  "qualificationScore" INTEGER DEFAULT 0,
  "researchNotes" TEXT,
  "painPoints" TEXT,
  source VARCHAR(128),
  "campaignId" INTEGER,
  "lastContactedAt" TIMESTAMP,
  "nextFollowUpAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  "targetIndustry" VARCHAR(128),
  "targetLocation" VARCHAR(255),
  "targetCompanySize" VARCHAR(64),
  offer TEXT,
  status VARCHAR(32) DEFAULT 'draft' NOT NULL,
  "totalLeads" INTEGER DEFAULT 0,
  contacted INTEGER DEFAULT 0,
  replied INTEGER DEFAULT 0,
  qualified INTEGER DEFAULT 0,
  closed INTEGER DEFAULT 0,
  "revenueGenerated" DECIMAL(10,2) DEFAULT 0,
  "startedAt" TIMESTAMP,
  "completedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  "leadId" INTEGER NOT NULL,
  "campaignId" INTEGER,
  direction VARCHAR(16) NOT NULL,
  channel VARCHAR(32) NOT NULL,
  subject VARCHAR(512),
  body TEXT NOT NULL,
  "aiGenerated" BOOLEAN DEFAULT true,
  "sequenceStep" INTEGER DEFAULT 1,
  status VARCHAR(32) DEFAULT 'draft' NOT NULL,
  "sentAt" TIMESTAMP,
  "openedAt" TIMESTAMP,
  "repliedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Call briefs table
CREATE TABLE IF NOT EXISTS "callBriefs" (
  id SERIAL PRIMARY KEY,
  "leadId" INTEGER NOT NULL,
  "companyOverview" TEXT,
  "recentNews" TEXT,
  "estimatedPainPoints" TEXT,
  "recommendedAngle" TEXT,
  "suggestedOpeners" JSONB,
  "likelyObjections" JSONB,
  "suggestedPriceMin" DECIMAL(10,2),
  "suggestedPriceMax" DECIMAL(10,2),
  "pricingRationale" TEXT,
  "callOutcome" VARCHAR(32) DEFAULT 'not_called',
  "callNotes" TEXT,
  "callAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Daily briefings table
CREATE TABLE IF NOT EXISTS "dailyBriefings" (
  id SERIAL PRIMARY KEY,
  date VARCHAR(10) NOT NULL,
  "newLeadsFound" INTEGER DEFAULT 0,
  "messagesSent" INTEGER DEFAULT 0,
  "repliesReceived" INTEGER DEFAULT 0,
  "callsBooked" INTEGER DEFAULT 0,
  "dealsClosedToday" INTEGER DEFAULT 0,
  "revenueToday" DECIMAL(10,2) DEFAULT 0,
  "morningMessage" TEXT,
  "topPriorities" JSONB,
  "teamStatus" JSONB,
  "totalActiveLeads" INTEGER DEFAULT 0,
  "leadsReadyForCall" INTEGER DEFAULT 0,
  "followUpsDue" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);
