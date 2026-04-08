import type { Handler } from "@netlify/functions";
import { askClaude, parseJSON, PROMPTS } from "./lib/claude";
import { query } from "./lib/db";

export const handler: Handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    let stats = { total: 0, new: 0, contacted: 0, qualified: 0, callBooked: 0, closedWon: 0 };
    try {
      const rows = await query(`SELECT COUNT(*) as total, SUM(CASE WHEN status='new' THEN 1 ELSE 0 END) as new, SUM(CASE WHEN status='qualified' THEN 1 ELSE 0 END) as qualified, SUM(CASE WHEN status='call_booked' THEN 1 ELSE 0 END) as call_booked, SUM(CASE WHEN status='closed_won' THEN 1 ELSE 0 END) as closed_won FROM leads`);
      if (rows[0]) stats = { total: +rows[0].total||0, new: +rows[0].new||0, contacted: 0, qualified: +rows[0].qualified||0, callBooked: +rows[0].call_booked||0, closedWon: +rows[0].closed_won||0 };
    } catch {}
    const response = await askClaude(PROMPTS.tracker, `Generate a morning briefing. Stats: ${JSON.stringify(stats)}. Return JSON: {"morningMessage":"string","topPriorities":["p1","p2","p3"],"teamStatus":[]}`);
    const briefing = parseJSON(response, { morningMessage: "Good morning! Your AI Office is ready.", topPriorities: ["Launch first campaign", "Review pipeline", "Check email queue"], teamStatus: [] });
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, briefing, stats }) };
  } catch (e: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: e.message }) };
  }
};
