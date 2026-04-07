import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  getAgentsForUser,
  upsertDefaultAgents,
  getLeadsForUser,
  getLeadById,
  getCampaignsForUser,
  createCampaign,
  updateLeadStatus,
  getTodaysBriefing,
  getRecentBriefings,
  getDashboardStats,
  getCallBriefForLead,
  getMessagesForLead,
  getConversationHistory,
  clearConversationHistory,
} from "./db";
import {
  runResearcher,
  runWriter,
  runQualifier,
  runCloser,
  runTracker,
  chatWithAgent,
} from "./agentService";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── OFFICE SETUP ──────────────────────────────────────────────────────────
  office: router({
    // Bootstrap the user's AI team (creates all 6 agents if they don't exist)
    setup: protectedProcedure.mutation(async ({ ctx }) => {
      await upsertDefaultAgents(ctx.user!.id);
      const agents = await getAgentsForUser(ctx.user!.id);
      return { success: true, agents };
    }),

    // Get all six agents and their current status
    getTeam: protectedProcedure.query(async ({ ctx }) => {
      return getAgentsForUser(ctx.user!.id);
    }),

    // Dashboard stats
    getStats: protectedProcedure.query(async ({ ctx }) => {
      return getDashboardStats(ctx.user!.id);
    }),
  }),

  // ─── MORNING BRIEFING ──────────────────────────────────────────────────────
  briefing: router({
    // Get today's briefing (generates if not yet created today)
    getToday: protectedProcedure.query(async ({ ctx }) => {
      const existing = await getTodaysBriefing(ctx.user!.id);
      if (existing) return { briefing: existing, fresh: false };
      // Generate fresh briefing via Tracker agent
      const result = await runTracker(ctx.user!.id);
      const fresh = await getTodaysBriefing(ctx.user!.id);
      return { briefing: fresh, fresh: true };
    }),

    // Force regenerate today's briefing
    regenerate: protectedProcedure.mutation(async ({ ctx }) => {
      return runTracker(ctx.user!.id);
    }),

    // Get last 7 days of briefings
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      return getRecentBriefings(ctx.user!.id, 7);
    }),
  }),

  // ─── CAMPAIGNS ─────────────────────────────────────────────────────────────
  campaigns: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getCampaignsForUser(ctx.user!.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        targetIndustry: z.string().optional(),
        targetLocation: z.string().optional(),
        targetCompanySize: z.string().optional(),
        offer: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await createCampaign({ userId: ctx.user!.id, ...input });
        return { success: true };
      }),
  }),

  // ─── LEADS ─────────────────────────────────────────────────────────────────
  leads: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return getLeadsForUser(ctx.user!.id, input?.limit ?? 50);
      }),

    getOne: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return getLeadById(input.id);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        leadId: z.number(),
        status: z.enum(["new", "contacted", "replied", "qualified", "call_booked", "closed_won", "closed_lost", "unsubscribed"]),
      }))
      .mutation(async ({ ctx, input }) => {
        await updateLeadStatus(input.leadId, input.status);
        return { success: true };
      }),

    getMessages: protectedProcedure
      .input(z.object({ leadId: z.number() }))
      .query(async ({ ctx, input }) => {
        return getMessagesForLead(input.leadId);
      }),

    getCallBrief: protectedProcedure
      .input(z.object({ leadId: z.number() }))
      .query(async ({ ctx, input }) => {
        return getCallBriefForLead(input.leadId);
      }),
  }),

  // ─── AGENT ACTIONS ─────────────────────────────────────────────────────────
  agents: router({
    // Researcher: find new leads for a campaign
    research: protectedProcedure
      .input(z.object({
        campaignId: z.number(),
        targetIndustry: z.string(),
        targetLocation: z.string(),
        targetCompanySize: z.string().optional(),
        offer: z.string(),
        count: z.number().min(1).max(20).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return runResearcher(ctx.user!.id, input.campaignId, input);
      }),

    // Writer: write outreach email for a lead
    writeOutreach: protectedProcedure
      .input(z.object({
        leadId: z.number(),
        offer: z.string(),
        sequenceStep: z.number().optional(),
        campaignId: z.number().optional(),
        previousMessages: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return runWriter(ctx.user!.id, input.leadId, input);
      }),

    // Qualifier: qualify a lead based on their reply
    qualify: protectedProcedure
      .input(z.object({
        leadId: z.number(),
        replyText: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        return runQualifier(ctx.user!.id, input.leadId, input.replyText);
      }),

    // Closer: generate a pre-call brief for a lead
    prepCallBrief: protectedProcedure
      .input(z.object({ leadId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return runCloser(ctx.user!.id, input.leadId);
      }),

    // Chat with any agent
    chat: protectedProcedure
      .input(z.object({
        agentRole: z.enum(["researcher", "writer", "outreach", "qualifier", "closer", "tracker"]),
        message: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        return chatWithAgent(ctx.user!.id, input.agentRole, input.message);
      }),

    // Get conversation history with an agent
    getConversation: protectedProcedure
      .input(z.object({ agentId: z.number() }))
      .query(async ({ ctx, input }) => {
        return getConversationHistory(input.agentId, ctx.user!.id, 30);
      }),

    // Clear conversation history with an agent
    clearConversation: protectedProcedure
      .input(z.object({ agentId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await clearConversationHistory(input.agentId, ctx.user!.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
