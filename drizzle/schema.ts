import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
} from "drizzle-orm/mysql-core";

// ─── USERS ────────────────────────────────────────────────────────────────────

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── AGENTS ───────────────────────────────────────────────────────────────────
// The six AI team members in your office

export const agents = mysqlTable("agents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", [
    "researcher",
    "writer",
    "outreach",
    "qualifier",
    "closer",
    "tracker",
  ]).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["idle", "working", "done", "error"]).default("idle").notNull(),
  systemPrompt: text("systemPrompt"),
  tasksCompleted: int("tasksCompleted").default(0).notNull(),
  lastActiveAt: timestamp("lastActiveAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

// ─── LEADS ────────────────────────────────────────────────────────────────────

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
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
  status: mysqlEnum("status", [
    "new",
    "contacted",
    "replied",
    "qualified",
    "call_booked",
    "closed_won",
    "closed_lost",
    "unsubscribed",
  ]).default("new").notNull(),
  qualificationScore: int("qualificationScore").default(0),
  researchNotes: text("researchNotes"),
  painPoints: text("painPoints"),
  source: varchar("source", { length: 128 }),
  campaignId: int("campaignId"),
  lastContactedAt: timestamp("lastContactedAt"),
  nextFollowUpAt: timestamp("nextFollowUpAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ─── CAMPAIGNS ────────────────────────────────────────────────────────────────

export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  targetIndustry: varchar("targetIndustry", { length: 128 }),
  targetLocation: varchar("targetLocation", { length: 255 }),
  targetCompanySize: varchar("targetCompanySize", { length: 64 }),
  offer: text("offer"),
  status: mysqlEnum("status", ["draft", "active", "paused", "completed"]).default("draft").notNull(),
  totalLeads: int("totalLeads").default(0).notNull(),
  contacted: int("contacted").default(0).notNull(),
  replied: int("replied").default(0).notNull(),
  qualified: int("qualified").default(0).notNull(),
  closed: int("closed").default(0).notNull(),
  revenueGenerated: decimal("revenueGenerated", { precision: 10, scale: 2 }).default("0"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

// ─── TASKS ────────────────────────────────────────────────────────────────────

export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  agentId: int("agentId").notNull(),
  campaignId: int("campaignId"),
  leadId: int("leadId"),
  type: mysqlEnum("type", [
    "find_leads",
    "research_company",
    "find_contact",
    "write_outreach",
    "write_followup",
    "write_proposal",
    "send_email",
    "send_followup",
    "qualify_lead",
    "score_response",
    "prep_call_brief",
    "generate_pitch",
    "daily_report",
    "weekly_summary",
  ]).notNull(),
  status: mysqlEnum("status", ["queued", "in_progress", "completed", "failed", "skipped"]).default("queued").notNull(),
  priority: mysqlEnum("priority", ["low", "normal", "high", "urgent"]).default("normal").notNull(),
  inputData: json("inputData"),
  outputData: json("outputData"),
  result: text("result"),
  errorMessage: text("errorMessage"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// ─── OUTREACH MESSAGES ────────────────────────────────────────────────────────

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  leadId: int("leadId").notNull(),
  campaignId: int("campaignId"),
  direction: mysqlEnum("direction", ["outbound", "inbound"]).notNull(),
  channel: mysqlEnum("channel", ["email", "linkedin", "sms", "whatsapp", "twitter", "other"]).notNull(),
  subject: varchar("subject", { length: 512 }),
  body: text("body").notNull(),
  aiGenerated: boolean("aiGenerated").default(true),
  agentId: int("agentId"),
  sequenceStep: int("sequenceStep").default(1),
  status: mysqlEnum("status", ["draft", "sent", "delivered", "opened", "replied", "bounced", "failed"]).default("draft").notNull(),
  sentAt: timestamp("sentAt"),
  openedAt: timestamp("openedAt"),
  repliedAt: timestamp("repliedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// ─── CALL BRIEFS ──────────────────────────────────────────────────────────────

export const callBriefs = mysqlTable("callBriefs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  leadId: int("leadId").notNull(),
  agentId: int("agentId").notNull(),
  companyOverview: text("companyOverview"),
  recentNews: text("recentNews"),
  estimatedPainPoints: text("estimatedPainPoints"),
  recommendedAngle: text("recommendedAngle"),
  suggestedOpeners: json("suggestedOpeners"),
  likelyObjections: json("likelyObjections"),
  suggestedPriceMin: decimal("suggestedPriceMin", { precision: 10, scale: 2 }),
  suggestedPriceMax: decimal("suggestedPriceMax", { precision: 10, scale: 2 }),
  pricingRationale: text("pricingRationale"),
  callOutcome: mysqlEnum("callOutcome", [
    "not_called",
    "no_show",
    "not_interested",
    "follow_up_needed",
    "proposal_sent",
    "closed",
  ]).default("not_called"),
  callNotes: text("callNotes"),
  callAt: timestamp("callAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CallBrief = typeof callBriefs.$inferSelect;
export type InsertCallBrief = typeof callBriefs.$inferInsert;

// ─── DAILY BRIEFINGS ──────────────────────────────────────────────────────────

export const dailyBriefings = mysqlTable("dailyBriefings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  newLeadsFound: int("newLeadsFound").default(0),
  messagesSent: int("messagesSent").default(0),
  repliesReceived: int("repliesReceived").default(0),
  callsBooked: int("callsBooked").default(0),
  dealsClosedToday: int("dealsClosedToday").default(0),
  revenueToday: decimal("revenueToday", { precision: 10, scale: 2 }).default("0"),
  morningMessage: text("morningMessage"),
  topPriorities: json("topPriorities"),
  teamStatus: json("teamStatus"),
  totalActiveLeads: int("totalActiveLeads").default(0),
  leadsReadyForCall: int("leadsReadyForCall").default(0),
  followUpsDue: int("followUpsDue").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyBriefing = typeof dailyBriefings.$inferSelect;
export type InsertDailyBriefing = typeof dailyBriefings.$inferInsert;

// ─── AGENT CONVERSATIONS ──────────────────────────────────────────────────────

export const agentConversations = mysqlTable("agentConversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  agentId: int("agentId").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentConversation = typeof agentConversations.$inferSelect;
export type InsertAgentConversation = typeof agentConversations.$inferInsert;
