export type EntryVisibility = "private" | "circle" | "public";

/** How a one-person timed release should be delivered once backend is connected. */
export type IndividualReleaseChannel = "sms" | "email" | "portal";

export type IndividualRelease = {
  channel: IndividualReleaseChannel;
  /** Phone number, email, or portal username (their account on this site). */
  target: string;
};

/** Who must wait until `unlockAt` before the entry is revealed. */
export type TimedAudience =
  | "none"
  | "self"
  | "circles"
  | "public"
  | "individual";

export type JournalEntry = {
  id: string;
  body: string;
  tags: string[];
  visibility: EntryVisibility;
  circleIds: string[];
  /** ISO datetime — when the timed audience can see this entry. */
  unlockAt: string | null;
  timedAudience: TimedAudience;
  /**
   * When `timedAudience` is `individual`, where to notify them (SMS / email / portal).
   * Delivery is not wired up yet — this stores intent for your future integrations.
   */
  individualRelease?: IndividualRelease;
  createdAt: string;
  updatedAt: string;
};

export type Circle = {
  id: string;
  name: string;
  memberNames: string[];
  notes?: string;
  createdAt: string;
};

export type FamilyMember = {
  id: string;
  displayName: string;
  relation: string;
  /** Optional link to another family row (e.g. parent ↔ child). */
  linkedToId: string | null;
  generationLabel?: string;
  createdAt: string;
};

export type UserProfile = {
  displayName: string;
  username: string;
  bio: string;
  /** Public “autobiography” strip at `/p/[username]` */
  publicAutobiography: boolean;
  /** Opt-in: later — surface thematic echoes across users */
  aiSimilarThemesOptIn: boolean;
  /** Opt-in: later — uplifting past entries & reflection help */
  aiReflectionOptIn: boolean;
};

export type JournalState = {
  profile: UserProfile;
  entries: JournalEntry[];
  circles: Circle[];
  family: FamilyMember[];
};
