/** Curated journaling prompts — same calendar day picks the same default. */

export const JOURNAL_PROMPTS: readonly string[] = [
  "What felt meaningful today, even if it was small?",
  "What would you tell someone you love if you weren’t afraid of being too honest?",
  "What did you handle better than you would have a year ago?",
  "Who showed up for you lately — and how did that feel?",
  "What are you avoiding thinking about? One honest sentence.",
  "What did your body need today, and did you listen?",
  "What would make tomorrow feel 10% kinder to yourself?",
  "What’s something you’re proud of that you rarely admit out loud?",
  "What’s a worry that might look smaller in a month?",
  "When did you last feel truly at ease? What was around you?",
  "What boundary do you wish you’d held this week?",
  "What did you learn recently that changed how you see something?",
  "Write a letter to your future self about right now.",
  "What are you grateful for that isn’t a person or a thing?",
  "What would you do this weekend if you weren’t trying to be productive?",
  "What’s something you forgave yourself for — or want to?",
  "What conversation are you replaying in your head? What would you say differently?",
  "What place makes you feel most like yourself?",
  "What did you need to hear today?",
  "What habit is quietly steering your days lately?",
  "What’s one thing you want to remember about this season of life?",
  "Who do you miss — and what do you miss about them?",
  "What’s working in your life that you didn’t expect to work?",
  "What are you building toward, even if slowly?",
];

function dayOfYear(d = new Date()): number {
  const y = d.getFullYear();
  const start = new Date(y, 0, 0).getTime();
  return Math.floor((d.getTime() - start) / 86400000);
}

/** Default prompt for “today” — stable for the whole calendar day in local time. */
export function dailyPrompt(date = new Date()): string {
  const i = dayOfYear(date) % JOURNAL_PROMPTS.length;
  return JOURNAL_PROMPTS[i];
}

/** Rotate through the list from today’s starting point (offset 0 = daily prompt). */
export function promptWithOffset(offset: number, date = new Date()): string {
  const base = dayOfYear(date) % JOURNAL_PROMPTS.length;
  const i = ((base + offset) % JOURNAL_PROMPTS.length + JOURNAL_PROMPTS.length) % JOURNAL_PROMPTS.length;
  return JOURNAL_PROMPTS[i];
}
