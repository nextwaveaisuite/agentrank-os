import type { Handler } from "@netlify/functions";
import { askClaude, parseJSON, AGENT_PROMPTS } from "./lib/claude";
import { query } from "./lib/db";

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // Get stats from database
    let stats = { total: 0, new: 0, contacted: 0, qualified: 0, callBooked: 0, closedWon: 0 };
    let activeCampaigns = 0;

    try {
      const leadStats = await query(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
          SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
          SUM(CASE WHEN status = 'qualified' THEN 1 ELSE 0 END) as qualified,
          SUM(CASE WHEN status = 'call_booked' THEN 1 ELSE 0 END) as call_booked,
          SUM(CASE WHEN status = 'closed_won' THEN 1 ELSE 0 END) as closed_won
        FROM leads
      `);

      if (leadStats[0]) {
        stats = {
          total: parseInt(leadStats[0].total) || 0,
          new: parseInt(leadStats[0].new) || 0,
          contacted: parseInt(leadStats[0].contacted) || 0,
          qualified: parseInt(leadStats[0].qualified) || 0,
          callBooked: parseInt(leadStats[0].call_booked) || 0,
          closedWon: parseInt(leadStats[0].closed_won) || 0,
        };
      }

      const campaigns = await query(`SELECT COUNT(*) as count FROM campaigns WHERE status = 'active'`);
      activeCampaigns = parseInt(campaigns[0]?.count) || 0;
    } catch {
      // DB not set up yet — use defaults
    }

    const prompt = `Generate a morning briefing for an AI lead generation office.

Stats:
- Total leads: ${stats.total}
- New (not contacted): ${stats.new}
- Contacted: ${stats.contacted}
- Qualified: ${stats.qualified}
- Calls booked: ${stats.callBooked}
- Deals closed: ${stats.closedWon}
- Active campaigns: ${activeCampaigns}

Return JSON only:
{
  "morningMessage": "2-3 sentence energising overview of where things stand",
  "topPriorities": ["Priority 1", "Priority 2", "Priority 3"],
  "teamStatus": [
    {"name": "Alex", "role": "Researcher", "status": "Ready", "note": "brief note"},
    {"name": "Sam", "role": "Writer", "status": "Ready", "note": "brief note"},
    {"name": "Jordan", "role": "Outreach", "status": "Ready", "note": "brief note"},
    {"name": "Morgan", "role": "Qualifier", "status": "Ready", "note": "brief note"},
    {"name": "Riley", "role": "Closer", "status": "Ready", "note": "brief note"},
    {"name": "Casey", "role": "Tracker", "status": "Done", "note": "Briefing complete"}
  ]
}`;

    const response = await askClaude(AGENT_PROMPTS.tracker, prompt);
    const briefing = parseJSON(response, {
      morningMessage: "Good morning! Your AI Office team is ready and standing by. Let's make today count.",
      topPriorities: ["Launch your first campaign", "Review your lead pipeline", "Check email approval queue"],
      teamStatus: [],
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, briefing, stats, activeCampaigns }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
