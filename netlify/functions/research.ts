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
      ? `Find 3 real individual people who are active buyers in the "${niche}" niche on ${platform || "ClickBank/WarriorPlus/JVZoo"}. These must be REAL PEOPLE — not businesses — who have shown they spend money on digital products in this niche. Think: people who leave reviews on WarriorPlus products, members of Facebook buyer groups, YouTubers who review these products, forum members on Warrior Forum, Reddit users in relevant subreddits, blog commenters, Discord members. They can be from anywhere in the world.

For each person provide:
- business_name: their username, online handle or full name
- contact_name: their first name or what to call them
- email: their contact email if findable, otherwise null
- location: their country (worldwide — USA, UK, Australia, Canada, India, Philippines etc)
- industry: "${niche}"
- notes: exactly WHERE they are active (e.g. "Active reviewer on WarriorPlus with 12 purchases in MMO niche", "Member of ClickBank Elite Buyers Facebook group", "Posts in r/juststart subreddit about affiliate products") and WHY they are a strong buyer lead

Return ONLY a JSON array with fields: business_name, contact_name, email, location, industry, notes. No other text.`
      : `Find 3 real ${industry} businesses in ${location} that could benefit from lead generation services. These should be real businesses with real contact details. For each provide: business_name, contact_name, email, phone, website, industry, location, notes (why they need leads). Return ONLY a JSON array. No other text.`;

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
          null,
          null,
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
