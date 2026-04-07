import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
  serial,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const agentRoleEnum = pgEnum("agent_role", ["researcher", "writer", "outreach", "qualifier", "closer", "tracker"]);
export const agentStatusEnum = pgEnum("agent_status", ["idle", "working", "done", "error"]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "replied", "qualified", "call_booked", "closed_won", "closed_lost", "unsubscribed"]);
export const campaignStatusEnum = pgEnum("campaign_status", ["draft", "active", "paused", "completed"]);
export const taskTypeEnum = pgEnum("task_type", ["find_leads", "research_company", "find_contact", "write_outreach", "write_followup", "write_proposal", "send_email", "send_followup", "qualify_lead", "score_response", "prep_call_brief", "generate_pitch", "daily_report", "weekly_summary"]);
export const taskStatusEnum = pgEnum("task_status", ["queued", "in_progress", "completed", "failed", "skipped"]);
export const taskPriorityEnum = pgEnum("task_priority", ["low", "normal", "high", "urgent"]);
export const messageDirectionEnum = pgEnum("message_direction", ["outbound", "inbound"]);
export const messageChannelEnum = pgEnum("message_channel", ["email", "linkedin", "sms", "whatsapp", "twitter", "other"]);
export const messageStatusEnum = pgEnum("message_status", ["draft", "sent", "delivered", "opened", "replied", "bounced", "failed"]);
export const callOutcomeEnum = pgEnum("call_outcome", ["not_called", "no_show", "not_interested", "follow_up_needed", "proposal_sent", "closed"]);
export const conversationRoleEnum = pgEnum("conversation_role", ["user", "assistant", "system"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  role: agentRoleEnum("role").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  status: agentStatusEnum("status").default("idle").notNull(),
  systemPrompt: text("systemPrompt"),
  tasksCompleted: integer("tasksCompleted").default(0).notNull(),
  lastActiveAt: timestamp("lastActiveAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  businessName: varchar("businessName", { length: 255 }),
  contactName: varchar("contactName", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 64 }),
  website: varchar("website", { length: 512 }),
  linkedinUrl: varchar("linkedinUrl", { length: 512 }),
  industry: varchar("industry", { length: 128 }),
  location: varchar("location", { length: 255 }),
  companySize: varchar("companySize", { length: 64 }),
  estimatedRevenue: varchar("estimatedRevenue", { length: 64 }),
  status: leadStatusEnum("status").default("new").notNull(),
  qualificationScore: integer("qualificationScore").default(0),
  researchNotes: text("researchNotes"),
  painPoints: text("painPoints"),
  source: varchar("source", { length: 128 }),
  campaignId: integer("campaignId"),
  lastContactedAt: timestamp("lastContactedAt"),
  nextFollowUpAt: timestamp("nextFollowUpAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  targetIndustry: varchar("targetIndustry", { length: 128 }),
  targetLocation: varchar("targetLocation", { length: 255 }),
  targetCompanySize: varchar("targetCompanySize", { length: 64 }),
  offer: text("offer"),
  status: campaignStatusEnum("status").default("draft").notNull(),
  totalLeads: integer("totalLeads").default(0).notNull(),
  contacted: integer("contacted").default(0).notNull(),
  replied: integer("replied").default(0).notNull(),
  qualified: integer("qualified").default(0).notNull(),
  closed: integer("closed").default(0).notNull(),
  revenueGenerated: decimal("revenueGenerated", { precision: 10, scale: 2 }).default("0"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  agentId: integer("agentId").notNull(),
  campaignId: integer("campaignId"),
  leadId: integer("leadId"),
  type: taskTypeEnum("type").notNull(),
  status: taskStatusEnum("status").default("queued").notNull(),
  priority: taskPriorityEnum("priority").default("normal").notNull(),
  inputData: json("inputData"),
  outputData: json("outputData"),
  result: text("result"),
  errorMessage: text("errorMessage"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  leadId: integer("leadId").notNull(),
  campaignId: integer("campaignId"),
  direction: messageDirectionEnum("direction").notNull(),
  channel: messageChannelEnum("channel").notNull(),
  subject: varchar("subject", { length: 512 }),
  body: text("body").notNull(),
  aiGenerated: boolean("aiGenerated").default(true),
  agentId: integer("agentId"),
  sequenceStep: integer("sequenceStep").default(1),
  status: messageStatusEnum("status").default("draft").notNull(),
  sentAt: timestamp("sentAt"),
  openedAt: timestamp("openedAt"),
  repliedAt: timestamp("repliedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

export const callBriefs = pgTable("callBriefs", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  leadId: integer("leadId").notNull(),
  agentId: integer("agentId").notNull(),
  companyOverview: text("companyOverview"),
  recentNews: text("recentNews"),
  estimatedPainPoints: text("estimatedPainPoints"),
  recommendedAngle: text("recommendedAngle"),
  suggestedOpeners: json("suggestedOpeners"),
  likelyObjections: json("likelyObjections"),
  suggestedPriceMin: decimal("suggestedPriceMin", { precision: 10, scale: 2 }),
  suggestedPriceMax: decimal("suggestedPriceMax", { precision: 10, scale: 2 }),
  pricingRationale: text("pricingRationale"),
  callOutcome: callOutcomeEnum("callOutcome").default("not_called"),
  callNotes: text("callNotes"),
  callAt: timestamp("callAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type CallBrief = typeof callBriefs.$inferSelect;
export type InsertCallBrief = typeof callBriefs.$inferInsert;

export const dailyBriefings = pgTable("dailyBriefings", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  newLeadsFound: integer("newLeadsFound").default(0),
  messagesSent: integer("messagesSent").default(0),
  repliesReceived: integer("repliesReceived").default(0),
  callsBooked: integer("callsBooked").default(0),
  dealsClosedToday: integer("dealsClosedToday").default(0),
  revenueToday: decimal("revenueToday", { precision: 10, scale: 2 }).default("0"),
  morningMessage: text("morningMessage"),
  topPriorities: json("topPriorities"),
  teamStatus: json("teamStatus"),
  totalActiveLeads: integer("totalActiveLeads").default(0),
  leadsReadyForCall: integer("leadsReadyForCall").default(0),
  followUpsDue: integer("followUpsDue").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type DailyBriefing = typeof dailyBriefings.$inferSelect;
export type InsertDailyBriefing = typeof dailyBriefings.$inferInsert;

export const agentConversations = pgTable("agentConversations", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  agentId: integer("agentId").notNull(),
  role: conversationRoleEnum("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AgentConversation = typeof agentConversations.$inferSelect;
export type InsertAgentConversation = typeof agentConversations.$inferInsert;
