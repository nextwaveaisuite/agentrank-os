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
    const { leadId, replyText } = body;

    let lead: any = null;
    try {
      const rows = await query(`SELECT * FROM leads WHERE id = $1`, [leadId]);
      lead = rows[0];
    } catch { }

    const prompt = `Qualify this lead based on their reply.

Lead: ${lead?.businessName ?? "Unknown"} — ${lead?.contactName ?? "Unknown"}
Industry: ${lead?.industry ?? "Unknown"}
Their reply: "${replyText}"

Score 0-100 using BANT (Budget, Authority, Need, Timing).

Return JSON only:
{
  "score": 0-100,
  "status": "qualified" or "nurture" or "disqualified",
  "reasoning": "2-3 sentence explanation",
  "recommendedNextStep": "specific action to take",
  "bookCall": true or false
}`;

    const response = await askClaude(AGENT_PROMPTS.qualifier, prompt);
    const qualification = parseJSON(response, {
      score: 0,
      status: "nurture",
      reasoning: "Unable to parse qualification",
      recommendedNextStep: "Review manually",
      bookCall: false,
    });

    // Update lead status
    if (leadId) {
      try {
        const newStatus = qualification.bookCall ? "call_booked" : qualification.status === "qualified" ? "qualified" : qualification.status === "disqualified" ? "closed_lost" : "replied";
        await query(`UPDATE leads SET status = $1, "qualificationScore" = $2, "updatedAt" = NOW() WHERE id = $3`, [newStatus, qualification.score, leadId]);
      } catch { }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, qualification }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
