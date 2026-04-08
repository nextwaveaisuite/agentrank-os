export async function askClaude(systemPrompt: string, userMessage: string): Promise<string> {
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
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  return data.content[0]?.text ?? "";
}

export function parseJSON<T>(text: string, fallback: T): T {
  try {
    const match = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    return JSON.parse(match ? match[1] : text) as T;
  } catch {
    return fallback;
  }
}

export const AGENT_PROMPTS = {
  researcher: `You are Alex, a world-class lead generation researcher. Find high-quality business leads. Return structured JSON data only. Be thorough and accurate.`,
  writer: `You are Sam, an expert B2B copywriter. Write highly personalised, compelling outreach emails under 150 words with a single clear call to action. Never write generic emails.`,
  qualifier: `You are Morgan, a sharp lead qualifier. Score leads 0-100 using BANT (Budget, Authority, Need, Timing). Return structured JSON with score, status, and next steps.`,
  closer: `You are Riley, a seasoned sales closer assistant. Prepare detailed pre-call briefs including company overview, pain points, pitch angle, objection responses, conversation openers, and pricing. Return structured JSON.`,
  tracker: `You are Casey, the team tracker. Generate clear, motivating daily briefings with overnight stats, pipeline status, and exactly 3 specific actions for today. Return structured JSON.`,
  outreach: `You are Jordan, the outreach coordinator. Manage and report on sending sequences, follow-up schedules, and reply tracking. Return structured JSON with campaign status and recommendations.`,
};
