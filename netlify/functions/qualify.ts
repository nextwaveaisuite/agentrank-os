import type { Handler } from "@netlify/functions";
import { askClaude, parseJSON, PROMPTS } from "./lib/claude";
import { query } from "./lib/db";

export const handler: Handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  try {
    const { leadId, replyText } = JSON.parse(event.body ?? "{}");
    let lead: any = null;
    try { const rows = await query(`SELECT * FROM leads WHERE id=$1`, [leadId]); lead = rows[0]; } catch {}
    const prompt = `Qualify this lead. Business: ${lead?.businessName}. Reply: "${replyText}". Score 0-100 using BANT. Return JSON: {"score":0,"status":"qualified|nurture|disqualified","reasoning":"","recommendedNextStep":"","bookCall":false}`;
    const response = await askClaude(PROMPTS.qualifier, prompt);
    const q = parseJSON(response, { score: 0, status: "nurture", reasoning: "", recommendedNextStep: "Review manually", bookCall: false });
    if (leadId) { try { const status = q.bookCall ? "call_booked" : q.status === "qualified" ? "qualified" : q.status === "disqualified" ? "closed_lost" : "replied"; await query(`UPDATE leads SET status=$1,"qualificationScore"=$2,"updatedAt"=NOW() WHERE id=$3`, [status, q.score, leadId]); } catch {} }
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, qualification: q }) };
  } catch (e: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: e.message }) };
  }
};
