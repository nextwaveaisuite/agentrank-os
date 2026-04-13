import { pool } from "./lib/db";
import { askClaude, parseJSON, PROMPTS } from "./lib/claude";

const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    const { campaignId, mode, niche, location, industry } = JSON.parse(event.body || "{}");

    const isAffiliate = mode === "affiliate";
    const systemPrompt = isAffiliate ? PROMPTS.affiliateResearcher : PROMPTS.researcher;

    const userMessage = isAffiliate
      ? `Find 3 targeted buyer leads for the "${niche}" niche. These should be people who have shown buying intent in this niche — active in relevant communities, asking questions about solutions, or have engaged with related content. For each lead provide: business_name (their name or handle), contact_name, email (if findable), location (city/country or "Online"), industry (use the niche name), notes (why they are a good buyer lead). Return as JSON array with fields: business_name, contact_name, email, phone, website, industry, location, notes.`
      : `Find 3 real ${industry} businesses in ${location} that could benefit from lead generation services. For each provide: business_name, contact_name, email, phone, website, industry, location, notes (why they need leads). Return as JSON array only.`;

    const raw = await askClaude(systemPrompt, userMessage);
    const leads = parseJSON(raw);

    if (!leads || !Array.isArray(leads)) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: "Could not parse leads" }) };
    }

    const inserted = [];
    for (const lead of leads.slice(0, 3)) {
      const r = await pool.query(
        "INSERT INTO leads (campaign_id, business_name, contact_name, email, phone, website, industry, location, notes, status, mode) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'new',$10) RETURNING *",
        [campaignId, lead.business_name, lead.contact_name, lead.email, lead.phone, lead.website, lead.industry, lead.location, lead.notes, mode || "business"]
      );
      inserted.push(r.rows[0]);
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, leads: inserted }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
