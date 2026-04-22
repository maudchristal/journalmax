import type { IndividualRelease, IndividualReleaseChannel } from "./types";

export function channelLabel(c: IndividualReleaseChannel): string {
  if (c === "sms") return "Text (SMS)";
  if (c === "email") return "Email";
  return "Website portal";
}

/** Normalize portal usernames: allow @prefix in UI, store without leading @ */
export function normalizeIndividualTarget(
  channel: IndividualReleaseChannel,
  raw: string,
): string {
  const t = raw.trim();
  if (channel === "portal") {
    return t.replace(/^@+/, "");
  }
  return t;
}

export function describeIndividualRelease(r: IndividualRelease): string {
  const via = channelLabel(r.channel);
  const dest =
    r.channel === "portal" && r.target
      ? `@${r.target}`
      : r.target;
  return `${via} → ${dest}`;
}
