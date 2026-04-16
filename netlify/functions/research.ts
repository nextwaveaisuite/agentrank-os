import { Pool } from "pg";
import { askClaude, parseJSON, PROMPTS } from "./lib/claude";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    const { campaignId, mode, niche, platform, location, industry } = JSON.parse(event.body || "{}");

    const isAffiliate = mode === "affiliate";

    const userMessage = isAffiliate
      ? `Find 3 highly targeted buyer leads for an affiliate marketer promoting a "${niche}" product on ${platform || "ClickBank/WarriorPlus/JVZoo"}.

These must be REAL buyer personas — people who are actively purchasing products in this niche on affiliate platforms. For each lead describe:
- business_name: their username, handle, or name as seen in buyer communities
- contact_name: their first name if known
- email: a plausible contact email if findable
- location: their country or region
- industry: "${niche}"
- notes: WHERE you found them (e.g. "Active in WarriorPlus buyer Facebook group for MMO offers", "Left reviews on 3 ClickBank products in weight loss niche", "YouTube commenter on JVZoo product review videos") and WHY they are a strong buyer lead

Return as a JSON array only with fields: business_name, contact_name, email, location, industry, notes.`
      : `Find 3 real ${industry} businesses in ${location} that could benefit from lead generation services. For each provide: business_name, contact_name, email, phone, website, industry, location, notes. Return as JSON array only.`;

    const raw = await askClaude(PROMPTS.affiliateResearcher, userMessage);
    const leads = parseJSON(raw);

    if (!leads || !Array.isArray(leads)) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: "Could not parse leads from AI" }) };
    }

    const inserted = [];
    for (const lead of leads.slice(0, 3)) {
      const r = await pool.query(
        `INSERT INTO leads
          ("campaignId", "businessName", "contactName", email, phone, website, industry, location, notes, status, mode)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'new',$10)
         RETURNING *`,
        [
          campaignId,
          lead.business_name,
          lead.contact_name,
          lead.email || null,
          lead.phone || null,
          lead.website || null,
          lead.industry,
          lead.location,
          lead.notes,
          mode || "business"
        ]
      );
      inserted.push(r.rows[0]);
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, leads: inserted }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
