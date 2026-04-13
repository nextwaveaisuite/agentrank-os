import { pool } from "./lib/db";
import { askClaude, PROMPTS } from "./lib/claude";

const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    const { leadId } = JSON.parse(event.body || "{}");
    const leadResult = await pool.query("SELECT * FROM leads WHERE id = $1", [leadId]);
    const lead = leadResult.rows[0];
    if (!lead) return { statusCode: 404, headers, body: JSON.stringify({ error: "Lead not found" }) };

    const msgs = await pool.query("SELECT * FROM messages WHERE lead_id = $1 ORDER BY created_at ASC", [leadId]);
    const history = msgs.rows.map((m: any) => `${m.agent}: ${m.content}`).join("\n\n");

    const brief = await askClaude(PROMPTS.closer, `Create a pre-call brief for ${lead.business_name} (${lead.industry}, ${lead.location}). Qualification score: ${lead.qualification_score || "unknown"}. Conversation history:\n${history || "No history yet."}\n\nInclude: key talking points, likely objections, recommended approach, and goal for the call.`);

    await pool.query("INSERT INTO messages (lead_id, agent, role, content) VALUES ($1, 'riley', 'call_brief', $2)", [leadId, brief]);

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, brief }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
