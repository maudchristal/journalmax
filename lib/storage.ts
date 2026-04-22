import type {
  IndividualRelease,
  JournalEntry,
  JournalState,
  TimedAudience,
} from "./types";

export const STORAGE_KEY = "journalmax-state-v1";

const defaultState = (): JournalState => ({
  profile: {
    displayName: "You",
    username: "me",
    bio: "",
    publicAutobiography: false,
    aiSimilarThemesOptIn: false,
    aiReflectionOptIn: false,
  },
  entries: [],
  circles: [],
  family: [],
});

function normalizeTimedAudience(v: unknown): TimedAudience {
  if (
    v === "self" ||
    v === "circles" ||
    v === "public" ||
    v === "individual" ||
    v === "none"
  )
    return v;
  return "none";
}

function normalizeIndividualRelease(raw: unknown): IndividualRelease | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const ch = o.channel;
  const target = String(o.target ?? "").trim();
  if (!target) return undefined;
  if (ch === "sms" || ch === "email" || ch === "portal") {
    return { channel: ch, target };
  }
  return undefined;
}

/** Migrate legacy saved entries (e.g. dropped `section` field). */
function normalizeEntry(raw: unknown): JournalEntry {
  const e = raw as Record<string, unknown>;
  return {
    id: String(e.id ?? ""),
    body: String(e.body ?? ""),
    tags: Array.isArray(e.tags) ? e.tags.map(String) : [],
    visibility:
      e.visibility === "circle" || e.visibility === "public"
        ? e.visibility
        : "private",
    circleIds: Array.isArray(e.circleIds) ? e.circleIds.map(String) : [],
    unlockAt: e.unlockAt == null || e.unlockAt === "" ? null : String(e.unlockAt),
    timedAudience: normalizeTimedAudience(e.timedAudience),
    individualRelease: normalizeIndividualRelease(e.individualRelease),
    createdAt: String(e.createdAt ?? new Date().toISOString()),
    updatedAt: String(
      e.updatedAt ?? e.createdAt ?? new Date().toISOString(),
    ),
  };
}

export function loadState(): JournalState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as JournalState;
    return {
      ...defaultState(),
      ...parsed,
      profile: { ...defaultState().profile, ...parsed.profile },
      entries: Array.isArray(parsed.entries)
        ? parsed.entries.map(normalizeEntry).filter((e) => e.id)
        : [],
      circles: Array.isArray(parsed.circles) ? parsed.circles : [],
      family: Array.isArray(parsed.family) ? parsed.family : [],
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: JournalState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}
