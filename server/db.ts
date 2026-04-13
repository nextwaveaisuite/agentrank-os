import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  users, agents, leads, campaigns, tasks, messages, callBriefs, dailyBriefings, agentConversations,
  InsertUser, InsertAgent, InsertLead, InsertCampaign, InsertTask,
  InsertMessage, InsertCallBrief, InsertDailyBriefing, InsertAgentConversation,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

// ─── DB INSTANCE ──────────────────────────────────────────────────────────────

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  textFields.forEach((field) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  });

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0] ?? undefined;
}

// ─── AGENTS ───────────────────────────────────────────────────────────────────

export async function getAgentsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(agents).where(eq(agents.userId, userId));
}

export async function upsertDefaultAgents(userId: number) {
  const db = await getDb();
  if (!db) return;

  const defaultAgents: Omit<InsertAgent, "userId">[] = [
    {
      role: "researcher",
      name: "Alex",
      systemPrompt: `You are Alex, a world-class lead generation researcher. Your job is to find high-quality business leads for lead generation campaigns. When given a target industry, location, or company type, you research and return detailed prospect information including business name, contact name, email, website, LinkedIn URL, company size, and estimated revenue. You identify pain points these businesses likely face. You are thorough, accurate, and focus on quality over quantity. Always return structured data.`,
    },
    {
      role: "writer",
      name: "Sam",
      systemPrompt: `You are Sam, an expert copywriter specialising in B2B outreach. Your job is to write highly personalised, compelling outreach emails and follow-up messages that get responses. You never write generic emails. You always personalise based on the prospect's business, industry, and specific pain points. Your emails are concise (under 150 words), conversational, and have a clear single call to action. You write like a human, not a robot.`,
    },
    {
      role: "outreach",
      name: "Jordan",
      systemPrompt: `You are Jordan, the outreach coordinator. Your job is to manage the sending sequence for lead generation campaigns. You track which messages have been sent, when follow-ups are due, and ensure no lead falls through the cracks. You report on delivery status, open rates, and reply rates. You escalate leads who reply to the qualifier immediately.`,
    },
    {
      role: "qualifier",
      name: "Morgan",
      systemPrompt: `You are Morgan, a sharp lead qualifier. Your job is to analyse responses from prospects and determine their quality and readiness to buy. You score leads from 0-100 based on: budget signals, authority (are they the decision maker?), need (do they have the problem we solve?), and timing (are they ready to move?). You provide a clear qualification summary and recommend next steps: book a call, nurture more, or disqualify.`,
    },
    {
      role: "closer",
      name: "Riley",
      systemPrompt: `You are Riley, a seasoned sales closer assistant. Your job is to prepare the human for every sales call by producing a detailed pre-call brief. Given a lead's information, you research their company, identify likely pain points, craft a tailored pitch angle, prepare responses to common objections, suggest conversation openers, and recommend a pricing range. Your briefs give the human everything they need to walk into the call confident and prepared.`,
    },
    {
      role: "tracker",
      name: "Casey",
      systemPrompt: `You are Casey, the team tracker and morning briefing specialist. Each morning you generate a clear, energising briefing summarising what the team accomplished overnight, the current pipeline status, today's top priorities, and which leads need immediate attention. You track all metrics: leads found, messages sent, replies received, calls booked, and revenue generated. You present data clearly and always end with 3 specific actions for the day.`,
    },
  ];

  for (const agentData of defaultAgents) {
    const existing = await db
      .select()
      .from(agents)
      .where(and(eq(agents.userId, userId), eq(agents.role, agentData.role)))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(agents).values({ ...agentData, userId });
    }
  }
}

export async function updateAgentStatus(
  agentId: number,
  status: "idle" | "working" | "done" | "error"
) {
  const db = await getDb();
  if (!db) return;
  await db.update(agents).set({ status, lastActiveAt: new Date() }).where(eq(agents.id, agentId));
}

// ─── LEADS ────────────────────────────────────────────────────────────────────

export async function getLeadsForUser(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).where(eq(leads.userId, userId)).orderBy(desc(leads.createdAt)).limit(limit);
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result[0] ?? undefined;
}

export async function createLead(data: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(leads).values(data);
  return result;
}

export async function updateLeadStatus(
  leadId: number,
  status: Lead["status"],
  extra?: Partial<InsertLead>
) {
  const db = await getDb();
  if (!db) return;
  await db.update(leads).set({ status, updatedAt: new Date(), ...extra }).where(eq(leads.id, leadId));
}

export async function getLeadsByStatus(userId: number, status: Lead["status"]) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).where(and(eq(leads.userId, userId), eq(leads.status, status)));
}

// ─── CAMPAIGNS ────────────────────────────────────────────────────────────────

export async function getCampaignsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(campaigns).where(eq(campaigns.userId, userId)).orderBy(desc(campaigns.createdAt));
}

export async function createCampaign(data: InsertCampaign) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(campaigns).values(data);
  return result;
}

export async function updateCampaignStats(campaignId: number) {
  const db = await getDb();
  if (!db) return;

  const [stats] = await db
    .select({
      totalLeads: sql<number>`COUNT(*)`,
      contacted: sql<number>`SUM(CASE WHEN ${leads.status} != 'new' THEN 1 ELSE 0 END)`,
      replied: sql<number>`SUM(CASE WHEN ${leads.status} IN ('replied','qualified','call_booked','closed_won') THEN 1 ELSE 0 END)`,
      qualified: sql<number>`SUM(CASE WHEN ${leads.status} IN ('qualified','call_booked','closed_won') THEN 1 ELSE 0 END)`,
      closed: sql<number>`SUM(CASE WHEN ${leads.status} = 'closed_won' THEN 1 ELSE 0 END)`,
    })
    .from(leads)
    .where(eq(leads.campaignId, campaignId));

  await db.update(campaigns).set({
    totalLeads: stats.totalLeads ?? 0,
    contacted: stats.contacted ?? 0,
    replied: stats.replied ?? 0,
    qualified: stats.qualified ?? 0,
    closed: stats.closed ?? 0,
    updatedAt: new Date(),
  }).where(eq(campaigns.id, campaignId));
}

// ─── TASKS ────────────────────────────────────────────────────────────────────

export async function createTask(data: InsertTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tasks).values(data);
  return result;
}

export async function getTasksForAgent(agentId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).where(eq(tasks.agentId, agentId)).orderBy(desc(tasks.createdAt)).limit(limit);
}

export async function completeTask(taskId: number, result: string, outputData?: unknown) {
  const db = await getDb();
  if (!db) return;
  await db.update(tasks).set({
    status: "completed",
    result,
    outputData: outputData as any,
    completedAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(tasks.id, taskId));
}

export async function failTask(taskId: number, errorMessage: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(tasks).set({
    status: "failed",
    errorMessage,
    completedAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(tasks.id, taskId));
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(messages).values(data);
}

export async function getMessagesForLead(leadId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(messages).where(eq(messages.leadId, leadId)).orderBy(messages.createdAt);
}

// ─── CALL BRIEFS ──────────────────────────────────────────────────────────────

export async function createCallBrief(data: InsertCallBrief) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(callBriefs).values(data);
}

export async function getCallBriefForLead(leadId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(callBriefs).where(eq(callBriefs.leadId, leadId)).orderBy(desc(callBriefs.createdAt)).limit(1);
  return result[0] ?? undefined;
}

// ─── DAILY BRIEFINGS ──────────────────────────────────────────────────────────

export async function getTodaysBriefing(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const today = new Date().toISOString().split("T")[0];
  const result = await db.select().from(dailyBriefings).where(
    and(eq(dailyBriefings.userId, userId), eq(dailyBriefings.date, today))
  ).limit(1);
  return result[0] ?? undefined;
}

export async function saveDailyBriefing(data: InsertDailyBriefing) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(dailyBriefings).values(data);
}

export async function getRecentBriefings(userId: number, limit = 7) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dailyBriefings).where(eq(dailyBriefings.userId, userId)).orderBy(desc(dailyBriefings.createdAt)).limit(limit);
}

// ─── AGENT CONVERSATIONS ──────────────────────────────────────────────────────

export async function getConversationHistory(agentId: number, userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(agentConversations).where(
    and(eq(agentConversations.agentId, agentId), eq(agentConversations.userId, userId))
  ).orderBy(agentConversations.createdAt).limit(limit);
}

export async function appendConversationMessage(data: InsertAgentConversation) {
  const db = await getDb();
  if (!db) return;
  await db.insert(agentConversations).values(data);
}

export async function clearConversationHistory(agentId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(agentConversations).where(
    and(eq(agentConversations.agentId, agentId), eq(agentConversations.userId, userId))
  );
}

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────

export async function getDashboardStats(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const [leadStats] = await db
    .select({
      total: sql<number>`COUNT(*)`,
      new: sql<number>`SUM(CASE WHEN ${leads.status} = 'new' THEN 1 ELSE 0 END)`,
      contacted: sql<number>`SUM(CASE WHEN ${leads.status} = 'contacted' THEN 1 ELSE 0 END)`,
      qualified: sql<number>`SUM(CASE WHEN ${leads.status} = 'qualified' THEN 1 ELSE 0 END)`,
      callBooked: sql<number>`SUM(CASE WHEN ${leads.status} = 'call_booked' THEN 1 ELSE 0 END)`,
      closedWon: sql<number>`SUM(CASE WHEN ${leads.status} = 'closed_won' THEN 1 ELSE 0 END)`,
    })
    .from(leads)
    .where(eq(leads.userId, userId));

  const activeCampaigns = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.userId, userId), eq(campaigns.status, "active")));

  return {
    leads: leadStats,
    activeCampaigns: activeCampaigns.length,
  };
}

// Re-export Lead type for use in updateLeadStatus
import type { Lead } from "../drizzle/schema";
