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
      ? `You are finding buyer leads for an affiliate marketer. Return ONLY a valid JSON array — no intro text, no explanation, no markdown, no code blocks. Just the raw JSON array.

Find 3 individual people who actively buy digital products in the "${niche}" niche on ${platform || "ClickBank, WarriorPlus or JVZoo"}. These are real people worldwide — USA, UK, Australia, Canada, India, Philippines, anywhere.

Return exactly this format:
[
  {
    "business_name": "their username or online handle",
    "contact_name": "their first name",
    "email": null,
    "location": "their country",
    "industry": "${niche}",
    "notes": "where they are active and why they are a buyer lead"
  }
]`
      : `You are finding business leads. Return ONLY a valid JSON array — no intro text, no explanation, no markdown, no code blocks. Just the raw JSON array.

Find 3 real ${industry} businesses in ${location} that need lead generation services.

Return exactly this format:
[
  {
    "business_name": "Business Name",
    "contact_name": "Contact Name",
    "email": "email@example.com",
    "phone": null,
    "website": null,
    "industry": "${industry}",
    "location": "${location}",
    "notes": "why they need leads"
  }
]`;

    const raw = await askClaude(PROMPTS.affiliateResearcher, userMessage);

    let leads = parseJSON(raw);

    if (!leads || !Array.isArray(leads)) {
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          leads = JSON.parse(match[0]);
        } catch {
          leads = null;
        }
      }
    }

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: "Could not parse leads from AI", raw: raw.substring(0, 200) }) };
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
          lead.business_name || lead.businessName || "Unknown",
          lead.contact_name || lead.contactName || null,
          lead.email || null,
          lead.phone || null,
          lead.website || null,
          lead.industry || niche || industry,
          lead.location || "Global",
          lead.notes || null,
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
