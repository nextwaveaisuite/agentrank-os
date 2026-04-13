import { pool } from "./lib/db";
import { askClaude, PROMPTS } from "./lib/claude";

const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    const { leadId, reply } = JSON.parse(event.body || "{}");
    const leadResult = await pool.query("SELECT * FROM leads WHERE id = $1", [leadId]);
    const lead = leadResult.rows[0];
    if (!lead) return { statusCode: 404, headers, body: JSON.stringify({ error: "Lead not found" }) };

    const replyText = reply || lead.notes || "";
    const result = await askClaude(PROMPTS.qualifier, `Qualify this lead reply from ${lead.business_name} (${lead.industry}, ${lead.location}). Their reply: "${replyText}". Score 0-100, give reasoning and next action.`);

    const scoreMatch = result.match(/\b([0-9]{1,3})\b/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

    await pool.query("INSERT INTO messages (lead_id, agent, role, content) VALUES ($1, 'morgan', 'qualification', $2)", [leadId, result]);
    if (score) await pool.query("UPDATE leads SET qualification_score = $1 WHERE id = $2", [score, leadId]);

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, result }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
