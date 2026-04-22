"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useJournal } from "@/components/journal-provider";
import { channelLabel, normalizeIndividualTarget } from "@/lib/individual";
import type {
  EntryVisibility,
  IndividualReleaseChannel,
  TimedAudience,
} from "@/lib/types";

type ScheduleMode =
  | "none"
  | "self"
  | "circles"
  | "public"
  | "individual";

export function ComposeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addEntry, state } = useJournal();
  const [body, setBody] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");
  const [visibility, setVisibility] = useState<EntryVisibility>("private");
  const [circleIds, setCircleIds] = useState<string[]>([]);
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>("none");
  const [unlockAt, setUnlockAt] = useState("");
  const [individualChannel, setIndividualChannel] =
    useState<IndividualReleaseChannel>("email");
  const [individualTarget, setIndividualTarget] = useState("");

  useEffect(() => {
    const q = searchParams.get("prompt");
    if (q) setBody(q);
  }, [searchParams]);

  function tags(): string[] {
    return tagsRaw
      .split(/[,\s]+/)
      .map((t) => t.replace(/^#/, "").trim())
      .filter(Boolean);
  }

  function derivedTimedAudience(): TimedAudience {
    if (scheduleMode === "none") return "none";
    if (scheduleMode === "self") return "self";
    if (scheduleMode === "circles") return "circles";
    if (scheduleMode === "public") return "public";
    return "individual";
  }

  function derivedVisibility(): EntryVisibility {
    if (scheduleMode === "self" || scheduleMode === "individual")
      return "private";
    if (scheduleMode === "circles") return "circle";
    if (scheduleMode === "public") return "public";
    return visibility;
  }

  function submit() {
    if (!body.trim()) return;
    const iso =
      unlockAt && scheduleMode !== "none"
        ? new Date(unlockAt).toISOString()
        : null;
    const timed = derivedTimedAudience();
    const vis = derivedVisibility();
    let circles: string[] = [];
    if (vis === "circle") {
      circles =
        circleIds.length > 0
          ? circleIds
          : scheduleMode === "circles" && state.circles[0]
            ? [state.circles[0].id]
            : [];
    }

    const targetNorm = normalizeIndividualTarget(
      individualChannel,
      individualTarget,
    );
    const individualRelease =
      timed === "individual" && targetNorm
        ? { channel: individualChannel, target: targetNorm }
        : undefined;

    addEntry({
      body: body.trim(),
      tags: tags(),
      visibility: vis,
      circleIds: circles,
      unlockAt: timed !== "none" && iso ? iso : null,
      timedAudience: timed,
      individualRelease,
    });
    router.push("/");
  }

  const visSubmit = derivedVisibility();
  const canSubmit = body.trim().length > 0;
  const needsUnlock = scheduleMode !== "none" && !unlockAt;
  const needsCircles =
    visSubmit === "circle" &&
    (state.circles.length === 0 || circleIds.length === 0);
  const needsIndividualTarget =
    scheduleMode === "individual" &&
    !normalizeIndividualTarget(individualChannel, individualTarget);

  return (
    <div className="min-h-[70vh] rounded-xl border border-[#efefef] bg-white shadow-sm">
      <div className="border-b border-[#efefef] px-5 py-4 sm:px-6">
        <h1 className="text-xl font-semibold text-[#262626]">New entry</h1>
        <p className="mt-1 text-sm text-[#8e8e8e]">
          Saved in this browser until you connect sync and sign-in.
        </p>
      </div>
      <div className="space-y-5 px-5 py-5 sm:px-6">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8e8e8e]">
            Write
          </span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            placeholder="What happened today?"
            className="w-full resize-y rounded-lg border border-[#dbdbdb] bg-[#fafafa] px-3 py-2 text-[15px] leading-relaxed text-[#262626] outline-none placeholder:text-[#8e8e8e] focus:border-[#a8a8a8]"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8e8e8e]">
            Tags
          </span>
          <input
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
            placeholder="gratitude, move, new chapter"
            className="w-full rounded-lg border border-[#dbdbdb] bg-white px-3 py-2 text-[15px] text-[#262626] outline-none focus:border-[#a8a8a8]"
          />
        </label>

        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#8e8e8e]">
            Audience
          </span>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["private", "Private"],
                ["circle", "Close circle"],
                ["public", "Public"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                disabled={scheduleMode !== "none"}
                onClick={() => setVisibility(v)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  scheduleMode === "none" && visibility === v
                    ? "bg-[#262626] text-white"
                    : "bg-[#efefef] text-[#262626]"
                } ${scheduleMode !== "none" ? "opacity-40" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
          {scheduleMode !== "none" ? (
            <p className="mt-2 text-xs text-[#8e8e8e]">
              Audience follows the schedule type below.
            </p>
          ) : null}
        </div>

        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#8e8e8e]">
            Time release
          </span>
          <div className="space-y-2">
            {(
              [
                ["none", "No schedule"],
                ["self", "Letter to my future self"],
                ["individual", "Release to one person on a date"],
                ["circles", "Release to circles on a date"],
                ["public", "Publish publicly on a date"],
              ] as const
            ).map(([mode, label]) => (
              <label
                key={mode}
                className="flex cursor-pointer items-start gap-2 rounded-lg border border-[#efefef] px-3 py-2"
              >
                <input
                  type="radio"
                  name="schedule"
                  checked={scheduleMode === mode}
                  onChange={() => {
                    setScheduleMode(mode);
                    if (mode === "none") setUnlockAt("");
                  }}
                  className="mt-1"
                />
                <span className="text-sm text-[#262626]">{label}</span>
              </label>
            ))}
          </div>
          {scheduleMode === "individual" ? (
            <p className="mt-2 text-xs text-[#8e8e8e]">
              We&apos;ll use this to route the release by text, email, or their
              account portal once messaging is connected.
            </p>
          ) : null}
        </div>

        {scheduleMode === "individual" ? (
          <div className="space-y-3 rounded-lg border border-[#efefef] bg-[#fafafa] px-3 py-3">
            <span className="block text-xs font-semibold uppercase tracking-wide text-[#8e8e8e]">
              Send to
            </span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["sms", channelLabel("sms")],
                  ["email", channelLabel("email")],
                  ["portal", channelLabel("portal")],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setIndividualChannel(id)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                    individualChannel === id
                      ? "bg-[#262626] text-white"
                      : "bg-white text-[#262626] ring-1 ring-[#dbdbdb]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="mb-1 block text-xs text-[#8e8e8e]">
                {individualChannel === "sms"
                  ? "Mobile number"
                  : individualChannel === "email"
                    ? "Email address"
                    : "Their username on this site"}
              </span>
              <input
                value={individualTarget}
                onChange={(e) => setIndividualTarget(e.target.value)}
                placeholder={
                  individualChannel === "portal"
                    ? "username (no @ needed)"
                    : individualChannel === "email"
                      ? "name@example.com"
                      : "+1 …"
                }
                className="w-full rounded-lg border border-[#dbdbdb] bg-white px-3 py-2 text-[15px] text-[#262626] outline-none focus:border-[#a8a8a8]"
                autoComplete="off"
              />
            </label>
          </div>
        ) : null}

        {(scheduleMode === "circles" ||
          (scheduleMode === "none" && visibility === "circle")) && (
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#8e8e8e]">
              Circles
            </span>
            {state.circles.length === 0 ? (
              <p className="text-sm text-[#8e8e8e]">
                Create a circle under the Circles tab first.
              </p>
            ) : (
              <div className="space-y-2">
                {state.circles.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={circleIds.includes(c.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCircleIds([...circleIds, c.id]);
                        } else {
                          setCircleIds(circleIds.filter((id) => id !== c.id));
                        }
                      }}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {scheduleMode !== "none" ? (
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8e8e8e]">
              Unlock date & time
            </span>
            <input
              type="datetime-local"
              value={unlockAt}
              onChange={(e) => setUnlockAt(e.target.value)}
              className="w-full rounded-lg border border-[#dbdbdb] bg-white px-3 py-2 text-[15px] text-[#262626] outline-none focus:border-[#a8a8a8]"
            />
          </label>
        ) : null}

        <button
          type="button"
          disabled={
            !canSubmit || needsUnlock || needsCircles || needsIndividualTarget
          }
          onClick={submit}
          className="w-full rounded-lg bg-[#0095f6] py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          Share to journal
        </button>
        {needsUnlock ? (
          <p className="text-center text-xs text-[#ed4956]">
            Pick a date for timed release.
          </p>
        ) : null}
        {needsCircles ? (
          <p className="text-center text-xs text-[#ed4956]">
            Choose at least one circle (or create circles first).
          </p>
        ) : null}
        {needsIndividualTarget ? (
          <p className="text-center text-xs text-[#ed4956]">
            Add how to reach that person (phone, email, or portal username).
          </p>
        ) : null}
      </div>
    </div>
  );
}
