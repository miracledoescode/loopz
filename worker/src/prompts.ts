export interface RankTaskInput {
  rawText: string;
  role: string;
  energyWindow: string;
  todaysWin: string;
  currentTime: string; // ISO string
  excludedTasks?: string[];
}

const ROLE_BIAS: Record<string, string> = {
  developer:
    'Shipping working code outranks planning or reading docs. ' +
    'Unblock yourself before helping others. Code review and bug fixes that ' +
    'affect other people outrank solo refactors.',
  student:
    'Nearest deadlines (exams, assignments due soon) outrank open-ended studying. ' +
    'Anything graded beats anything optional.',
  trader:
    'Time-sensitive, market-hours-relevant actions outrank research or admin ' +
    'that can happen anytime.',
  creator:
    'Anything that ships or publishes outranks behind-the-scenes prep that ' +
    'never reaches an audience.',
  other: 'Use judgement — favor whatever most reduces open loops.',
};

export function buildRankingPrompt(input: RankTaskInput): string {
  const bias = ROLE_BIAS[input.role] ?? ROLE_BIAS.other;

  const exclusionClause =
    input.excludedTasks && input.excludedTasks.length > 0
      ? `\n\nDo NOT suggest anything similar to these previously rejected tasks:\n${input.excludedTasks.map((t) => `- "${t}"`).join('\n')}\nPick a genuinely different action from the brain dump.`
      : '';

  return `You are Loopz, a focus coach whose only job is to remove decision paralysis.
A user just brain-dumped everything on their mind, unfiltered. Your job: pick the SINGLE
most important next action, and break it into 3-5 tiny, concrete micro-steps they can
start on immediately.

Context:
- Role: ${input.role}
- Best energy window: ${input.energyWindow}
- Today's win, in their own words: "${input.todaysWin}"
- Current time: ${input.currentTime}
- Ranking bias for this role: ${bias}

Rules:
- Pick exactly ONE task. Do not return a list of options.
- Each micro-step must be small enough to start in under 2 minutes of "getting ready."
- estMinutes per micro-step should be realistic (5-30 min), not padded.
- If the brain dump mentions an explicit deadline or "urgent" language, that overrides role bias.
- Never invent context the user didn't give you. If the dump is vague, pick the most
  concrete actionable thread in it rather than asking a clarifying question.
- Return between 3 and 5 micro-steps. Never fewer than 3, never more than 5.${exclusionClause}

Brain dump:
"""
${input.rawText}
"""

Respond with ONLY valid JSON, no prose, no markdown fences, matching exactly this schema:
{
  "task": {
    "title": string,
    "microSteps": [ { "text": string, "estMinutes": number } ]
  }
}`;
}
