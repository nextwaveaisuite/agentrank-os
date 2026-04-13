/**
 * agentService.ts
 * The brain of your AI Office.
 * Each function runs one of your six agents using the existing invokeLLM infrastructure.
 */

import { invokeLLM } from "./_core/llm";
import {
  getAgentsForUser,
  updateAgentStatus,
  createTask,
  completeTask,
  failTask,
  createLead,
  updateLeadStatus,
  createMessage,
  createCallBrief,
  saveDailyBriefing,
  getDashboardStats,
  getLeadsForUser,
  getLeadById,
  getConversationHistory,
  appendConversationMessage,
} from "./db";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function extractText(result: Awaited<ReturnType<typeof invokeLLM>>): string {
  const content = result.choices[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((c): c is { type: "text"; text: string } => c.type === "text")
      .map((c) => c.text)
      .join("\n");
  }
  return "";
}

function parseJSON<T>(text: string, fallback: T): T {
  try {
    const match = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    return JSON.parse(match ? match[1] : text) as T;
  } catch {
    return fallback;
  }
}

// ─── RESEARCHER AGENT ────────────────────────────────────────────────────────

export async function runResearcher(
  userId: number,
  campaignId: number,
  params: {
    targetIndustry: string;
    targetLocation: string;
    targetCompanySize?: string;
    offer: string;
    count?: number;
  }
) {
  const userAgents = await getAgentsForUser(userId);
  const agent = userAgents.find((a) => a.role === "researcher");
  if (!agent) throw new Error("Researcher agent not found. Run setup first.");

  await updateAgentStatus(agent.id, "working");

  const taskResult = await createTask({
    userId,
    agentId: agent.id,
    campaignId,
    type: "find_leads",
    priority: "normal",
    inputData: params as any,
  });

  const taskId = (taskResult as any).insertId as number;

  try {
    const prompt = `Find ${params.count ?? 5} high-quality business leads for this campaign.

Target: ${params.targetIndustry} businesses in ${params.targetLocation}${params.targetCompanySize ? `, company size: ${params.targetCompanySize}` : ""}
Our offer: ${params.offer}

For each lead, provide a JSON array with objects containing:
- businessName (string)
- contactName (string) 
- email (string, guess format if needed e.g. firstname@domain.com)
- phone (string, optional)
- website (string)
- linkedinUrl (string, optional)
- industry (string)
- location (string)
- companySize (string)
- estimatedRevenue (string)
- source (string, e.g. "Google Search", "LinkedIn")
- researchNotes (string, 2-3 sentences about this business)
- painPoints (string, likely pain points relevant to our offer)

Return ONLY a valid JSON array, no other text.`;

    const llmResult = await invokeLLM({
      messages: [
        { role: "system", content: agent.systemPrompt ?? "" },
        { role: "user", content: prompt },
      ],
    });

    const text = extractText(llmResult);
    const leadsData = parseJSON<any[]>(text, []);

    const createdLeads = [];
    for (const lead of leadsData) {
      await createLead({
        userId,
        campaignId,
        businessName: lead.businessName,
        contactName: lead.contactName,
        email: lead.email,
        phone: lead.phone,
        website: lead.website,
        linkedinUrl: lead.linkedinUrl,
        industry: lead.industry,
        location: lead.location,
        companySize: lead.companySize,
        estimatedRevenue: lead.estimatedRevenue,
        source: lead.source,
        researchNotes: lead.researchNotes,
        painPoints: lead.painPoints,
        status: "new",
      });
      createdLeads.push(lead.businessName);
    }

    await completeTask(taskId, `Found ${createdLeads.length} leads: ${createdLeads.join(", ")}`, leadsData as any);
    await updateAgentStatus(agent.id, "idle");

    return { success: true, leadsCreated: createdLeads.length, leads: leadsData };
  } catch (error: any) {
    await failTask(taskId, error.message);
    await updateAgentStatus(agent.id, "error");
    throw error;
  }
}

// ─── WRITER AGENT ─────────────────────────────────────────────────────────────

export async function runWriter(
  userId: number,
  leadId: number,
  params: {
    offer: string;
    sequenceStep?: number;
    campaignId?: number;
    previousMessages?: string;
  }
) {
  const userAgents = await getAgentsForUser(userId);
  const agent = userAgents.find((a) => a.role === "writer");
  if (!agent) throw new Error("Writer agent not found.");

  const lead = await getLeadById(leadId);
  if (!lead) throw new Error("Lead not found.");

  await updateAgentStatus(agent.id, "working");

  const taskResult = await createTask({
    userId,
    agentId: agent.id,
    leadId,
    campaignId: params.campaignId,
    type: params.sequenceStep && params.sequenceStep > 1 ? "write_followup" : "write_outreach",
    priority: "normal",
    inputData: params as any,
  });

  const taskId = (taskResult as any).insertId as number;

  try {
    const isFollowUp = params.sequenceStep && params.sequenceStep > 1;
    const prompt = `Write a ${isFollowUp ? "follow-up" : "first outreach"} email for this prospect.

Prospect details:
- Business: ${lead.businessName}
- Contact: ${lead.contactName}
- Industry: ${lead.industry}
- Location: ${lead.location}
- Company size: ${lead.companySize}
- Pain points: ${lead.painPoints}
- Research notes: ${lead.researchNotes}

Our offer: ${params.offer}
${params.previousMessages ? `\nPrevious messages sent:\n${params.previousMessages}` : ""}

Write a ${isFollowUp ? "follow-up (sequence step " + params.sequenceStep + ")" : "cold outreach"} email.
Return JSON with:
{
  "subject": "email subject line",
  "body": "email body (plain text, under 150 words, conversational, personalised, one clear CTA)"
}

Return ONLY valid JSON.`;

    const llmResult = await invokeLLM({
      messages: [
        { role: "system", content: agent.systemPrompt ?? "" },
        { role: "user", content: prompt },
      ],
    });

    const text = extractText(llmResult);
    const emailData = parseJSON<{ subject: string; body: string }>(text, {
      subject: "Following up",
      body: text,
    });

    await createMessage({
      userId,
      leadId,
      campaignId: params.campaignId,
      direction: "outbound",
      channel: "email",
      subject: emailData.subject,
      body: emailData.body,
      aiGenerated: true,
      agentId: agent.id,
      sequenceStep: params.sequenceStep ?? 1,
      status: "draft",
    });

    await completeTask(taskId, `Written: ${emailData.subject}`, emailData as any);
    await updateAgentStatus(agent.id, "idle");

    return { success: true, email: emailData };
  } catch (error: any) {
    await failTask(taskId, error.message);
    await updateAgentStatus(agent.id, "error");
    throw error;
  }
}

// ─── QUALIFIER AGENT ──────────────────────────────────────────────────────────

export async function runQualifier(
  userId: number,
  leadId: number,
  replyText: string
) {
  const userAgents = await getAgentsForUser(userId);
  const agent = userAgents.find((a) => a.role === "qualifier");
  if (!agent) throw new Error("Qualifier agent not found.");

  const lead = await getLeadById(leadId);
  if (!lead) throw new Error("Lead not found.");

  await updateAgentStatus(agent.id, "working");

  const taskResult = await createTask({
    userId,
    agentId: agent.id,
    leadId,
    type: "qualify_lead",
    priority: "high",
    inputData: { replyText } as any,
  });

  const taskId = (taskResult as any).insertId as number;

  try {
    const prompt = `Qualify this lead based on their reply.

Lead: ${lead.businessName} — ${lead.contactName}
Industry: ${lead.industry}
Their reply: "${replyText}"

Score this lead 0-100 using BANT:
- Budget: Do they suggest they have budget?
- Authority: Are they the decision maker?
- Need: Do they have the problem we solve?
- Timing: Are they ready to move now?

Return JSON:
{
  "score": 0-100,
  "status": "qualified" | "nurture" | "disqualified",
  "reasoning": "2-3 sentence explanation",
  "recommendedNextStep": "specific action to take",
  "bookCall": true/false
}

Return ONLY valid JSON.`;

    const llmResult = await invokeLLM({
      messages: [
        { role: "system", content: agent.systemPrompt ?? "" },
        { role: "user", content: prompt },
      ],
    });

    const text = extractText(llmResult);
    const qualification = parseJSON<{
      score: number;
      status: string;
      reasoning: string;
      recommendedNextStep: string;
      bookCall: boolean;
    }>(text, { score: 0, status: "nurture", reasoning: text, recommendedNextStep: "Review manually", bookCall: false });

    // Update lead status based on qualification
    const newStatus = qualification.bookCall
      ? "call_booked"
      : qualification.status === "qualified"
      ? "qualified"
      : qualification.status === "disqualified"
      ? "closed_lost"
      : "replied";

    await updateLeadStatus(leadId, newStatus as any, {
      qualificationScore: qualification.score,
    });

    await completeTask(taskId, qualification.reasoning, qualification as any);
    await updateAgentStatus(agent.id, "idle");

    return { success: true, qualification, newStatus };
  } catch (error: any) {
    await failTask(taskId, error.message);
    await updateAgentStatus(agent.id, "error");
    throw error;
  }
}

// ─── CLOSER AGENT ─────────────────────────────────────────────────────────────

export async function runCloser(userId: number, leadId: number) {
  const userAgents = await getAgentsForUser(userId);
  const agent = userAgents.find((a) => a.role === "closer");
  if (!agent) throw new Error("Closer agent not found.");

  const lead = await getLeadById(leadId);
  if (!lead) throw new Error("Lead not found.");

  await updateAgentStatus(agent.id, "working");

  const taskResult = await createTask({
    userId,
    agentId: agent.id,
    leadId,
    type: "prep_call_brief",
    priority: "high",
  });

  const taskId = (taskResult as any).insertId as number;

  try {
    const prompt = `Prepare a detailed pre-call brief for this sales call.

Lead details:
- Business: ${lead.businessName}
- Contact: ${lead.contactName}
- Industry: ${lead.industry}
- Location: ${lead.location}
- Company size: ${lead.companySize}
- Estimated revenue: ${lead.estimatedRevenue}
- Known pain points: ${lead.painPoints}
- Research notes: ${lead.researchNotes}
- Qualification score: ${lead.qualificationScore}/100

Return JSON:
{
  "companyOverview": "2-3 sentence snapshot of this business",
  "recentNews": "any relevant recent news or context",
  "estimatedPainPoints": "specific pain points this business likely faces",
  "recommendedAngle": "the best pitch angle for this prospect",
  "suggestedOpeners": ["opener 1", "opener 2", "opener 3"],
  "likelyObjections": [
    {"objection": "...", "response": "..."},
    {"objection": "...", "response": "..."},
    {"objection": "...", "response": "..."}
  ],
  "suggestedPriceMin": 500,
  "suggestedPriceMax": 2000,
  "pricingRationale": "why this price range makes sense for them"
}

Return ONLY valid JSON.`;

    const llmResult = await invokeLLM({
      messages: [
        { role: "system", content: agent.systemPrompt ?? "" },
        { role: "user", content: prompt },
      ],
    });

    const text = extractText(llmResult);
    const brief = parseJSON<any>(text, {});

    await createCallBrief({
      userId,
      leadId,
      agentId: agent.id,
      companyOverview: brief.companyOverview,
      recentNews: brief.recentNews,
      estimatedPainPoints: brief.estimatedPainPoints,
      recommendedAngle: brief.recommendedAngle,
      suggestedOpeners: brief.suggestedOpeners,
      likelyObjections: brief.likelyObjections,
      suggestedPriceMin: brief.suggestedPriceMin?.toString(),
      suggestedPriceMax: brief.suggestedPriceMax?.toString(),
      pricingRationale: brief.pricingRationale,
    });

    await completeTask(taskId, `Call brief prepared for ${lead.businessName}`, brief);
    await updateAgentStatus(agent.id, "idle");

    return { success: true, brief };
  } catch (error: any) {
    await failTask(taskId, error.message);
    await updateAgentStatus(agent.id, "error");
    throw error;
  }
}

// ─── TRACKER AGENT (MORNING BRIEFING) ────────────────────────────────────────

export async function runTracker(userId: number) {
  const userAgents = await getAgentsForUser(userId);
  const agent = userAgents.find((a) => a.role === "tracker");
  if (!agent) throw new Error("Tracker agent not found.");

  await updateAgentStatus(agent.id, "working");

  const taskResult = await createTask({
    userId,
    agentId: agent.id,
    type: "daily_report",
    priority: "normal",
  });

  const taskId = (taskResult as any).insertId as number;

  try {
    const stats = await getDashboardStats(userId);
    const allLeads = await getLeadsForUser(userId, 100);

    const today = new Date().toISOString().split("T")[0];
    const todayLeads = allLeads.filter(
      (l) => l.createdAt.toISOString().split("T")[0] === today
    );

    const followUpsDue = allLeads.filter(
      (l) =>
        l.nextFollowUpAt &&
        new Date(l.nextFollowUpAt) <= new Date() &&
        !["closed_won", "closed_lost", "unsubscribed"].includes(l.status)
    );

    const readyForCall = allLeads.filter(
      (l) => l.status === "call_booked" || l.status === "qualified"
    );

    const prompt = `Generate an energising morning briefing for the office.

Today's stats:
- New leads found today: ${todayLeads.length}
- Total leads in pipeline: ${stats?.leads.total ?? 0}
- New (not yet contacted): ${stats?.leads.new ?? 0}
- Contacted: ${stats?.leads.contacted ?? 0}
- Replied: 0
- Qualified: ${stats?.leads.qualified ?? 0}
- Calls booked: ${stats?.leads.callBooked ?? 0}
- Deals closed (total): ${stats?.leads.closedWon ?? 0}
- Active campaigns: ${stats?.activeCampaigns ?? 0}
- Follow-ups due today: ${followUpsDue.length}
- Leads ready for call: ${readyForCall.length}

Your team (all active):
- Alex (Researcher): Finding new leads
- Sam (Writer): Crafting outreach
- Jordan (Outreach): Managing sequences
- Morgan (Qualifier): Scoring responses
- Riley (Closer): Prepping call briefs
- Casey (Tracker): That's you!

Write a morning briefing. Return JSON:
{
  "morningMessage": "Warm, motivating 3-4 sentence overview of where things stand and what the team did",
  "topPriorities": [
    "Priority 1 - specific action",
    "Priority 2 - specific action", 
    "Priority 3 - specific action"
  ],
  "teamStatus": [
    {"agent": "Alex", "role": "researcher", "status": "idle", "note": "Ready for new research tasks"},
    {"agent": "Sam", "role": "writer", "status": "idle", "note": "Ready to write outreach"},
    {"agent": "Jordan", "role": "outreach", "status": "idle", "note": "Sequences up to date"},
    {"agent": "Morgan", "role": "qualifier", "status": "idle", "note": "Inbox clear"},
    {"agent": "Riley", "role": "closer", "status": "idle", "note": "Ready for call briefs"},
    {"agent": "Casey", "role": "tracker", "status": "done", "note": "Briefing complete"}
  ]
}

Return ONLY valid JSON.`;

    const llmResult = await invokeLLM({
      messages: [
        { role: "system", content: agent.systemPrompt ?? "" },
        { role: "user", content: prompt },
      ],
    });

    const text = extractText(llmResult);
    const briefingData = parseJSON<any>(text, {
      morningMessage: "Good morning! Your AI Office team is ready. Let's make today count.",
      topPriorities: ["Review your pipeline", "Launch a new campaign", "Follow up on replies"],
      teamStatus: [],
    });

    await saveDailyBriefing({
      userId,
      date: today,
      newLeadsFound: todayLeads.length,
      messagesSent: 0,
      repliesReceived: 0,
      callsBooked: 0,
      dealsClosedToday: 0,
      revenueToday: "0",
      morningMessage: briefingData.morningMessage,
      topPriorities: briefingData.topPriorities,
      teamStatus: briefingData.teamStatus,
      totalActiveLeads: stats?.leads.total ?? 0,
      leadsReadyForCall: readyForCall.length,
      followUpsDue: followUpsDue.length,
    });

    await completeTask(taskId, "Daily briefing generated", briefingData);
    await updateAgentStatus(agent.id, "idle");

    return { success: true, briefing: briefingData };
  } catch (error: any) {
    await failTask(taskId, error.message);
    await updateAgentStatus(agent.id, "error");
    throw error;
  }
}

// ─── CHAT WITH ANY AGENT ──────────────────────────────────────────────────────

export async function chatWithAgent(
  userId: number,
  agentRole: string,
  userMessage: string
) {
  const userAgents = await getAgentsForUser(userId);
  const agent = userAgents.find((a) => a.role === agentRole);
  if (!agent) throw new Error(`Agent with role '${agentRole}' not found.`);

  // Load conversation history
  const history = await getConversationHistory(agent.id, userId, 20);

  // Save user message
  await appendConversationMessage({
    userId,
    agentId: agent.id,
    role: "user",
    content: userMessage,
  });

  const messages = [
    { role: "system" as const, content: agent.systemPrompt ?? "" },
    ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
    { role: "user" as const, content: userMessage },
  ];

  const llmResult = await invokeLLM({ messages });
  const responseText = extractText(llmResult);

  // Save assistant response
  await appendConversationMessage({
    userId,
    agentId: agent.id,
    role: "assistant",
    content: responseText,
  });

  return { success: true, response: responseText, agentName: agent.name };
}
