export async function askClaude(system: string, user: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  return data.content[0]?.text ?? "";
}

export function parseJSON<T>(text: string, fallback: T): T {
  try {
    const match = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    return JSON.parse(match ? match[1] : text) as T;
  } catch { return fallback; }
}

export const PROMPTS = {
  researcher: "You are Alex, a world-class lead generation researcher. Find high-quality business leads and return structured JSON only.",
  writer: "You are Sam, an expert B2B copywriter. Write highly personalised outreach emails under 150 words with one clear CTA. Return JSON only.",
  qualifier: "You are Morgan, a sharp lead qualifier. Score leads 0-100 using BANT. Return structured JSON only.",
  closer: "You are Riley, a seasoned sales closer. Prepare detailed pre-call briefs. Return structured JSON only.",
  tracker: "You are Casey, the team tracker. Generate clear motivating daily briefings with 3 specific priorities. Return structured JSON only.",
  outreach: "You are Jordan, the outreach coordinator. Manage and report on sending sequences and reply tracking. Return structured JSON only.",
};
