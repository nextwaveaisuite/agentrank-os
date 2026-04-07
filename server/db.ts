import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  users, agents, leads, campaigns, tasks, messages, callBriefs, dailyBriefings, agentConversations,
  InsertUser, InsertAgent, InsertLead, InsertCampaign, InsertTask,
  InsertMessage, InsertCallBrief, InsertDailyBriefing, InsertAgentConversation,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import type { Lead } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
      _db = drizzle(pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required");
  const db = await getDb();
  if (!db) { console.warn("[Database] Not available"); return; }

  const role = user.openId === ENV.ownerOpenId ? "admin" : (user.role ?? "user");
  await db.insert(users).values({
    openId: user.openId,
    name: user.name ?? null,
    email: user.email ?? null,
    loginMethod: user.loginMethod ?? null,
    role,
    lastSignedIn: user.lastSignedIn ?? new Date(),
  }).onConflictDoUpdate({
    target: users.openId,
    set: {
      name: user.name ?? null,
      email: user.email ?? null,
      loginMethod: user.loginMethod ?? null,
      lastSignedIn: new Date(),
      updatedAt: new Date(),
    },
  });
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

  const defaultAgents = [
    {
      role: "researcher" as const,
      name: "Alex",
      systemPrompt: `You are Alex, a world-class lead generation researcher. Your job is to find high-quality business leads. When given a target industry, location, or company type, research and return detailed prospect information including business name, contact name, email, website, LinkedIn URL, company size, estimated revenue, and pain points. Be thorough and accurate. Always return structured JSON data.`,
    },
    {
      role: "writer" as const,
      name: "Sam",
      systemPrompt: `You are Sam, an expert B2B copywriter specialising in outreach. Write highly personalised, compelling emails that get responses. Never write generic emails. Always personalise based on the prospect's business and pain points. Keep emails under 150 words, conversational, with a single clear call to action. Write like a human.`,
    },
    {
      role: "outreach" as const,
      name: "Jordan",
      systemPrompt: `You are Jordan, the outreach coordinator. Manage sending sequences for lead generation campaigns. Track which messages have been sent, when follow-ups are due, and ensure no lead falls through the cracks. Report on delivery status and reply rates. Escalate leads who reply to the qualifier immediately.`,
    },
    {
      role: "qualifier" as const,
      name: "Morgan",
      systemPrompt: `You are Morgan, a sharp lead qualifier. Analyse responses from prospects and determine quality and readiness to buy. Score leads 0-100 based on BANT: Budget, Authority, Need, Timing. Provide a clear qualification summary and recommend next steps: book a call, nurture more, or disqualify.`,
    },
    {
      role: "closer" as const,
      name: "Riley",
      systemPrompt: `You are Riley, a seasoned sales closer assistant. Prepare detailed pre-call briefs including company overview, likely pain points, tailored pitch angle, objection responses, conversation openers, and pricing recommendations. Give the human everything they need to walk into the call confident.`,
    },
    {
      role: "tracker" as const,
      name: "Casey",
      systemPrompt: `You are Casey, the team tracker and morning briefing specialist. Each morning generate a clear, energising briefing summarising overnight activity, pipeline status, today's top priorities, and which leads need immediate attention. Always end with 3 specific actions for the day.`,
    },
  ];

  for (const agentData of defaultAgents) {
    const existing = await db.select().from(agents)
      .where(and(eq(agents.userId, userId), eq(agents.role, agentData.role))).limit(1);
    if (existing.length === 0) {
      await db.insert(agents).values({ ...agentData, userId });
    }
  }
}

export async function updateAgentStatus(agentId: number, status: "idle" | "working" | "done" | "error") {
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
  return db.insert(leads).values(data).returning();
}

export async function updateLeadStatus(leadId: number, status: Lead["status"], extra?: Partial<InsertLead>) {
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
  const result = await db.insert(campaigns).values(data).returning();
  return result[0];
}

// ─── TASKS ────────────────────────────────────────────────────────────────────

export async function createTask(data: InsertTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tasks).values(data).returning();
  return result[0];
}

export async function getTasksForAgent(agentId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).where(eq(tasks.agentId, agentId)).orderBy(desc(tasks.createdAt)).limit(limit);
}

export async function completeTask(taskId: number, result: string, outputData?: unknown) {
  const db = await getDb();
  if (!db) return;
  await db.update(tasks).set({ status: "completed", result, outputData: outputData as any, completedAt: new Date(), updatedAt: new Date() }).where(eq(tasks.id, taskId));
}

export async function failTask(taskId: number, errorMessage: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(tasks).set({ status: "failed", errorMessage, completedAt: new Date(), updatedAt: new Date() }).where(eq(tasks.id, taskId));
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(messages).values(data).returning();
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
  return db.insert(callBriefs).values(data).returning();
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
  const result = await db.select().from(dailyBriefings)
    .where(and(eq(dailyBriefings.userId, userId), eq(dailyBriefings.date, today))).limit(1);
  return result[0] ?? undefined;
}

export async function saveDailyBriefing(data: InsertDailyBriefing) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(dailyBriefings).values(data).returning();
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
  return db.select().from(agentConversations)
    .where(and(eq(agentConversations.agentId, agentId), eq(agentConversations.userId, userId)))
    .orderBy(agentConversations.createdAt).limit(limit);
}

export async function appendConversationMessage(data: InsertAgentConversation) {
  const db = await getDb();
  if (!db) return;
  await db.insert(agentConversations).values(data);
}

export async function clearConversationHistory(agentId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(agentConversations)
    .where(and(eq(agentConversations.agentId, agentId), eq(agentConversations.userId, userId)));
}

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────

export async function getDashboardStats(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const [leadStats] = await db.select({
    total: sql<number>`COUNT(*)`,
    new: sql<number>`SUM(CASE WHEN ${leads.status} = 'new' THEN 1 ELSE 0 END)`,
    contacted: sql<number>`SUM(CASE WHEN ${leads.status} = 'contacted' THEN 1 ELSE 0 END)`,
    qualified: sql<number>`SUM(CASE WHEN ${leads.status} = 'qualified' THEN 1 ELSE 0 END)`,
    callBooked: sql<number>`SUM(CASE WHEN ${leads.status} = 'call_booked' THEN 1 ELSE 0 END)`,
    closedWon: sql<number>`SUM(CASE WHEN ${leads.status} = 'closed_won' THEN 1 ELSE 0 END)`,
  }).from(leads).where(eq(leads.userId, userId));

  const activeCampaigns = await db.select().from(campaigns)
    .where(and(eq(campaigns.userId, userId), eq(campaigns.status, "active")));

  return { leads: leadStats, activeCampaigns: activeCampaigns.length };
}
