import { pool } from "./lib/db";
import { askClaude, parseJSON, PROMPTS } from "./lib/claude";

const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    const leadsResult = await pool.query("SELECT * FROM leads ORDER BY created_at DESC LIMIT 50");
    const leads = leadsResult.rows;
    const stats = {
      total: leads.length,
      new: leads.filter(l => l.status === "new").length,
      qualified: leads.filter(l => ["qualified", "call_ready"].includes(l.status)).length,
      callBooked: leads.filter(l => l.status === "call_ready").length,
      closedWon: 0,
    };

    const briefingText = await askClaude(
      PROMPTS.tracker,
      `Give a friendly morning briefing for AgentRank OS. Stats: ${stats.total} total leads, ${stats.new} new, ${stats.qualified} qualified, ${stats.callBooked} call ready. Respond as JSON with: morningMessage (2-3 sentences), topPriorities (array of 3 action items).`
    );

    const parsed = parseJSON(briefingText) || { morningMessage: briefingText, topPriorities: [] };

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, briefing: parsed, stats }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
