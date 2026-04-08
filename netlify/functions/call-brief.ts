import type { Handler } from "@netlify/functions";
import { askClaude, parseJSON, PROMPTS } from "./lib/claude";
import { query } from "./lib/db";

export const handler: Handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  try {
    const { leadId } = JSON.parse(event.body ?? "{}");
    let lead: any = null;
    try { const rows = await query(`SELECT * FROM leads WHERE id=$1`, [leadId]); lead = rows[0]; } catch {}
    if (!lead) return { statusCode: 404, headers, body: JSON.stringify({ error: "Lead not found" }) };
    const prompt = `Prepare pre-call brief for ${lead.businessName} (${lead.contactName}, ${lead.industry}, ${lead.location}, size: ${lead.companySize}). Pain points: ${lead.painPoints}. Return JSON: {"companyOverview":"","recentNews":"","estimatedPainPoints":"","recommendedAngle":"","suggestedOpeners":[],"likelyObjections":[{"objection":"","response":""}],"suggestedPriceMin":500,"suggestedPriceMax":2000,"pricingRationale":""}`;
    const response = await askClaude(PROMPTS.closer, prompt);
    const brief = parseJSON(response, {});
    try { await query(`INSERT INTO "callBriefs" ("leadId","companyOverview","recentNews","estimatedPainPoints","recommendedAngle","suggestedOpeners","likelyObjections","suggestedPriceMin","suggestedPriceMax","pricingRationale","callOutcome","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'not_called',NOW(),NOW())`, [leadId, brief.companyOverview, brief.recentNews, brief.estimatedPainPoints, brief.recommendedAngle, JSON.stringify(brief.suggestedOpeners), JSON.stringify(brief.likelyObjections), brief.suggestedPriceMin, brief.suggestedPriceMax, brief.pricingRationale]); } catch {}
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, brief }) };
  } catch (e: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: e.message }) };
  }
};
