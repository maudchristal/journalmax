import type { JournalEntry, TimedAudience } from "./types";

export function parseIso(d: string): Date {
  return new Date(d);
}

export function isPastOrNow(iso: string | null): boolean {
  if (!iso) return true;
  return parseIso(iso).getTime() <= Date.now();
}

/** Value for `<input type="datetime-local" />` in local time. */
export function toDatetimeLocalValue(iso: string): string {
  const d = parseIso(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Whether the entry is still sealed for the given timed audience (circles, public,
 * or a single recipient).
 */
export function isSealedFor(
  entry: JournalEntry,
  audience: TimedAudience,
): boolean {
  if (!entry.unlockAt || entry.timedAudience === "none") return false;
  if (entry.timedAudience !== audience) return false;
  return !isPastOrNow(entry.unlockAt);
}

/** Future letter to self — body stays sealed even for the author until `unlockAt`. */
export function isSealedLetterToSelf(entry: JournalEntry): boolean {
  if (!entry.unlockAt || entry.timedAudience !== "self") return false;
  return !isPastOrNow(entry.unlockAt);
}

/** Public readers can see this entry on `/p/[username]`. */
export function isPubliclyVisible(entry: JournalEntry): boolean {
  if (entry.visibility !== "public") return false;
  if (isSealedFor(entry, "public")) return false;
  return true;
}

/** Circle viewers (simulated) — visibility circle + not sealed for circles. */
export function isCircleVisible(entry: JournalEntry): boolean {
  if (entry.visibility !== "circle") return false;
  if (isSealedFor(entry, "circles")) return false;
  return true;
}
