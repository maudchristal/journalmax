"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useJournal } from "@/components/journal-provider";
import {
  channelLabel,
  describeIndividualRelease,
  normalizeIndividualTarget,
} from "@/lib/individual";
import { isSealedLetterToSelf, toDatetimeLocalValue } from "@/lib/time";
import type {
  EntryVisibility,
  IndividualReleaseChannel,
  TimedAudience,
} from "@/lib/types";

export default function EntryPage() {
  const params = useParams();
  const id = String(params.id);
  const router = useRouter();
  const { state, updateEntry, removeEntry } = useJournal();
  const entry = useMemo(
    () => state.entries.find((e) => e.id === id),
    [state.entries, id],
  );
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");
  const [visibility, setVisibility] = useState<EntryVisibility>("private");
  const [circleIds, setCircleIds] = useState<string[]>([]);
  const [timedAudience, setTimedAudience] = useState<TimedAudience>("none");
  const [unlockAt, setUnlockAt] = useState("");
  const [individualChannel, setIndividualChannel] =
    useState<IndividualReleaseChannel>("email");
  const [individualTarget, setIndividualTarget] = useState("");

  if (!entry) {
    return (
      <div className="px-4 py-12 text-center text-sm text-[#8e8e8e]">
        Entry not found.{" "}
        <Link href="/" className="font-semibold text-[#0095f6]">
          Home
        </Link>
      </div>
    );
  }

  function startEdit() {
    if (!entry) return;
    setBody(entry.body);
    setTagsRaw(entry.tags.join(", "));
    setVisibility(entry.visibility);
    setCircleIds(entry.circleIds);
    setTimedAudience(entry.timedAudience);
    setUnlockAt(entry.unlockAt ? toDatetimeLocalValue(entry.unlockAt) : "");
    if (entry.individualRelease) {
      setIndividualChannel(entry.individualRelease.channel);
      setIndividualTarget(entry.individualRelease.target);
    } else {
      setIndividualChannel("email");
      setIndividualTarget("");
    }
    setEditing(true);
  }

  const sealedSelf = isSealedLetterToSelf(entry);

  function save() {
    const targetNorm = normalizeIndividualTarget(
      individualChannel,
      individualTarget,
    );
    if (timedAudience === "individual" && !targetNorm) {
      window.alert("Add how to reach that person (phone, email, or portal username).");
      return;
    }
    const tags = tagsRaw
      .split(/[,\s]+/)
      .map((t) => t.replace(/^#/, "").trim())
      .filter(Boolean);
    const iso =
      timedAudience !== "none" && unlockAt
        ? new Date(unlockAt).toISOString()
        : null;
    const individualRelease =
      timedAudience === "individual" && targetNorm
        ? { channel: individualChannel, target: targetNorm }
        : undefined;
    const vis: EntryVisibility =
      timedAudience === "individual" ? "private" : visibility;

    updateEntry(id, {
      body: body.trim(),
      tags,
      visibility: vis,
      circleIds: vis === "circle" ? circleIds : [],
      timedAudience,
      unlockAt: timedAudience !== "none" && iso ? iso : null,
      individualRelease:
        timedAudience === "individual" ? individualRelease : undefined,
    });
    setEditing(false);
  }

  function remove() {
    if (!confirm("Delete this entry?")) return;
    removeEntry(id);
    router.push("/");
  }

  return (
    <div className="rounded-xl border border-[#efefef] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#efefef] px-5 py-3 sm:px-6">
        <Link href="/" className="text-sm font-semibold text-[#0095f6]">
          ← Back
        </Link>
        {!editing ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={startEdit}
              className="text-sm font-semibold text-[#262626]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={remove}
              className="text-sm font-semibold text-[#ed4956]"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={save}
            className="text-sm font-semibold text-[#0095f6]"
          >
            Save
          </button>
        )}
      </div>
      {!editing ? (
        <div className="px-5 py-5 sm:px-6">
          {entry.timedAudience === "individual" && entry.individualRelease ? (
            <p className="mb-3 text-sm text-[#8e8e8e]">
              One-person release:{" "}
              <span className="font-medium text-[#262626]">
                {describeIndividualRelease(entry.individualRelease)}
              </span>
            </p>
          ) : null}
          {sealedSelf ? (
            <div className="mb-4 rounded-lg border border-dashed border-[#dbdbdb] bg-[#fafafa] p-4 text-sm text-[#8e8e8e]">
              Sealed until{" "}
              {entry.unlockAt
                ? new Date(entry.unlockAt).toLocaleString()
                : ""}
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-[17px] leading-relaxed text-[#262626]">
              {entry.body}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4 px-5 py-5 sm:px-6">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            className="w-full rounded-lg border border-[#dbdbdb] px-3 py-2 text-[15px]"
          />
          <input
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
            className="w-full rounded-lg border border-[#dbdbdb] px-3 py-2 text-[15px]"
            placeholder="tags"
          />
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["private", "Private"],
                ["circle", "Circle"],
                ["public", "Public"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setVisibility(v)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  visibility === v
                    ? "bg-[#262626] text-white"
                    : "bg-[#efefef] text-[#262626]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {visibility === "circle" ? (
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
                        setCircleIds(circleIds.filter((x) => x !== c.id));
                      }
                    }}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          ) : null}
          <div>
            <span className="mb-1 block text-xs font-semibold text-[#8e8e8e]">
              Timed audience
            </span>
            <select
              value={timedAudience}
              onChange={(e) =>
                setTimedAudience(e.target.value as TimedAudience)
              }
              className="w-full rounded-lg border border-[#dbdbdb] px-3 py-2 text-[15px]"
            >
              <option value="none">None</option>
              <option value="self">Future self</option>
              <option value="individual">One person (SMS, email, or portal)</option>
              <option value="circles">Circles (after date)</option>
              <option value="public">Public (after date)</option>
            </select>
          </div>
          {timedAudience === "individual" ? (
            <div className="space-y-3 rounded-lg border border-[#efefef] bg-[#fafafa] px-3 py-3">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["sms", channelLabel("sms")],
                    ["email", channelLabel("email")],
                    ["portal", channelLabel("portal")],
                  ] as const
                ).map(([cid, label]) => (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => setIndividualChannel(cid)}
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                      individualChannel === cid
                        ? "bg-[#262626] text-white"
                        : "bg-white text-[#262626] ring-1 ring-[#dbdbdb]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <input
                value={individualTarget}
                onChange={(e) => setIndividualTarget(e.target.value)}
                placeholder={
                  individualChannel === "portal"
                    ? "username"
                    : individualChannel === "email"
                      ? "name@example.com"
                      : "+1 …"
                }
                className="w-full rounded-lg border border-[#dbdbdb] bg-white px-3 py-2 text-[15px]"
              />
            </div>
          ) : null}
          {timedAudience !== "none" ? (
            <input
              type="datetime-local"
              value={unlockAt}
              onChange={(e) => setUnlockAt(e.target.value)}
              className="w-full rounded-lg border border-[#dbdbdb] px-3 py-2 text-[15px]"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
