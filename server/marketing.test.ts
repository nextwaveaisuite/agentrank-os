import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context for testing
function createMockContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Marketing Platform - Agent Routers", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createMockContext();
  });

  describe("Content Agent", () => {
    it("should generate content with valid input", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contentAgent.generateContent({
        topic: "AI Marketing Trends",
        contentType: "blog_post",
        audience: "Marketing Managers",
        keywords: ["AI", "marketing", "automation"],
      });

      expect(result.success).toBe(true);
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
    });
  });

  describe("Traffic Agent", () => {
    it("should plan traffic strategy", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.trafficAgent.planTrafficStrategy({
        campaignType: "lead_gen",
        targetAudience: "B2B SaaS Companies",
        budget: "5000",
        goals: ["increase_leads", "improve_cpc"],
      });

      expect(result.success).toBe(true);
      expect(result.strategy).toBeDefined();
      expect(result.strategy.length).toBeGreaterThan(0);
    });
  });

  describe("Research Agent", () => {
    it("should conduct market research", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.researchAgent.conductMarketResearch({
        market: "AI Marketing Automation",
        competitors: ["HubSpot", "Marketo"],
        targetSegments: ["Enterprise", "Mid-Market"],
      });

      expect(result.success).toBe(true);
      expect(result.research).toBeDefined();
      expect(result.research.length).toBeGreaterThan(0);
    });
  });

  describe("Analytics Agent", () => {
    it("should analyze campaign performance", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.analyticsAgent.analyzePerformance({
        campaignId: 1,
        metrics: {
          leadsGenerated: 150,
          conversions: 18,
          revenue: 45000,
        },
        timeframe: "last_30_days",
      });

      expect(result.success).toBe(true);
      expect(result.analysis).toBeDefined();
      expect(result.analysis.length).toBeGreaterThan(0);
    });
  });

  describe("Outreach Agent", () => {
    it("should design outreach sequence", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.outreachAgent.designOutreachSequence({
        targetAudience: "VP of Marketing",
        campaignGoal: "Schedule Demo",
        leadCount: 100,
        budget: "2000",
      });

      expect(result.success).toBe(true);
      expect(result.sequence).toBeDefined();
      expect(result.sequence.length).toBeGreaterThan(0);
    });
  });

  describe("Funnel Agent", () => {
    it("should optimize sales funnel", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.funnelAgent.optimizeFunnel({
        currentMetrics: {
          visitors: 10000,
          signups: 500,
          trials: 150,
          conversions: 30,
        },
        funnelStages: ["awareness", "consideration", "decision", "purchase"],
        conversionGoal: 5,
      });

      expect(result.success).toBe(true);
      expect(result.optimization).toBeDefined();
      expect(result.optimization.length).toBeGreaterThan(0);
    });
  });
});

describe("Marketing Platform - Campaign Management", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createMockContext();
  });

  describe("Campaign Router", () => {
    it("should list campaigns for authenticated user", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.campaigns.list();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should create a new campaign", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.campaigns.create({
        name: "Q2 Lead Generation",
        type: "lead_gen",
        description: "Generate qualified B2B leads",
        budget: "10000",
        conversionGoal: 50,
        assignedAgents: [1, 2, 3],
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Agent Router", () => {
    it("should list all agents", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.list();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter agents by specialization", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.getBySpecialization({
        specialization: "content",
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Task Router", () => {
    it("should assign task to agent", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.tasks.assignTask({
        campaignId: 1,
        agentId: 1,
        taskType: "generate_content",
        description: "Generate 5 blog posts",
        creditsAllocated: "500",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Lead Router", () => {
    it("should create a new lead", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.leads.create({
        email: "prospect@company.com",
        firstName: "John",
        lastName: "Doe",
        company: "Acme Corp",
        source: "linkedin",
        campaignId: 1,
      });

      expect(result.success).toBe(true);
    });
  });
});

describe("Marketing Platform - Skills", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createMockContext();
  });

  describe("Skills Router", () => {
    it("should get available skills for agent specialization", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.skills.getAvailable({
        agentSpecialization: "outreach",
      });

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("description");
    });

    it("should execute scrape_leads skill", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.skills.execute({
        skillName: "scrape_leads",
        input: {
          source: "linkedin",
          query: "VP of Marketing at Tech Companies",
          limit: 50,
          campaignId: 1,
        },
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should execute send_email skill", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.skills.execute({
        skillName: "send_email",
        input: {
          leadId: 1,
          subject: "Exclusive Demo Offer",
          template: "sales_outreach",
          personalData: {
            email: "prospect@company.com",
            firstName: "John",
            company: "Acme Corp",
          },
        },
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("Email sent");
    });

    it("should execute post_social skill", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.skills.execute({
        skillName: "post_social",
        input: {
          platform: "linkedin",
          content: "Check out our new AI marketing automation platform!",
          hashtags: ["AI", "Marketing", "Automation"],
          mediaUrls: [],
        },
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should execute monitor_replies skill", async () => {
      const caller = appRouter.createCaller(ctx);

      const result = await caller.skills.execute({
        skillName: "monitor_replies",
        input: {
          platform: "linkedin",
          postId: "12345",
          campaignId: 1,
        },
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});

describe("Marketing Platform - Authentication", () => {
  it("should return current user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeDefined();
    expect(result?.email).toBe("test@example.com");
    expect(result?.name).toBe("Test User");
  });

  it("should logout user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result.success).toBe(true);
  });
});
