import type { Handler } from "@netlify/functions";
import { askClaude, parseJSON, AGENT_PROMPTS } from "./lib/claude";
import { query } from "./lib/db";

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  try {
    const body = JSON.parse(event.body ?? "{}");
    const { leadId } = body;

    let lead: any = null;
    try {
      const rows = await query(`SELECT * FROM leads WHERE id = $1`, [leadId]);
      lead = rows[0];
    } catch { }

    if (!lead) return { statusCode: 404, headers, body: JSON.stringify({ error: "Lead not found" }) };

    const prompt = `Prepare a detailed pre-call brief for this sales call.

Lead:
- Business: ${lead.businessName}
- Contact: ${lead.contactName}
- Industry: ${lead.industry}
- Location: ${lead.location}
- Company size: ${lead.companySize}
- Estimated revenue: ${lead.estimatedRevenue}
- Pain points: ${lead.painPoints}
- Research notes: ${lead.researchNotes}
- Qualification score: ${lead.qualificationScore}/100

Return JSON only:
{
  "companyOverview": "2-3 sentence snapshot",
  "recentNews": "any relevant context",
  "estimatedPainPoints": "specific pain points",
  "recommendedAngle": "best pitch angle for this prospect",
  "suggestedOpeners": ["opener 1", "opener 2", "opener 3"],
  "likelyObjections": [
    {"objection": "...", "response": "..."},
    {"objection": "...", "response": "..."},
    {"objection": "...", "response": "..."}
  ],
  "suggestedPriceMin": 500,
  "suggestedPriceMax": 2000,
  "pricingRationale": "why this price range makes sense"
}`;

    const response = await askClaude(AGENT_PROMPTS.closer, prompt);
    const brief = parseJSON(response, {});

    // Save brief to database
    try {
      await query(`
        INSERT INTO "callBriefs" (
          "leadId", "companyOverview", "recentNews", "estimatedPainPoints",
          "recommendedAngle", "suggestedOpeners", "likelyObjections",
          "suggestedPriceMin", "suggestedPriceMax", "pricingRationale",
          "callOutcome", "createdAt", "updatedAt"
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'not_called',NOW(),NOW())
      `, [
        leadId, brief.companyOverview, brief.recentNews, brief.estimatedPainPoints,
        brief.recommendedAngle, JSON.stringify(brief.suggestedOpeners),
        JSON.stringify(brief.likelyObjections), brief.suggestedPriceMin,
        brief.suggestedPriceMax, brief.pricingRationale
      ]);
    } catch { }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, brief }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
