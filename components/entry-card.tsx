"use client";

import Link from "next/link";
import { Lock, Users, Globe, Clock } from "lucide-react";
import { describeIndividualRelease } from "@/lib/individual";
import { isSealedLetterToSelf, isPastOrNow } from "@/lib/time";
import type { JournalEntry } from "@/lib/types";

type Props = {
  entry: JournalEntry;
  /** Owner sees full text except sealed letters to self */
  variant?: "owner" | "visitor";
};

function visibilityIcon(visibility: JournalEntry["visibility"]) {
  if (visibility === "private")
    return <Lock className="h-3.5 w-3.5 text-[#8e8e8e]" aria-hidden />;
  if (visibility === "circle")
    return <Users className="h-3.5 w-3.5 text-[#8e8e8e]" aria-hidden />;
  return <Globe className="h-3.5 w-3.5 text-[#8e8e8e]" aria-hidden />;
}

export function EntryCard({ entry, variant = "owner" }: Props) {
  const sealedSelf = variant === "owner" && isSealedLetterToSelf(entry);
  const showTimedBanner =
    variant === "owner" &&
    entry.unlockAt &&
    entry.timedAudience !== "none" &&
    entry.timedAudience !== "self" &&
    !isPastOrNow(entry.unlockAt);

  return (
    <article className="border-b border-[#efefef] px-4 py-4 last:border-b-0 sm:px-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-[#8e8e8e]">
          {visibilityIcon(entry.visibility)}
          <span className="capitalize">{entry.visibility}</span>
        </div>
        <Link
          href={`/entry/${entry.id}`}
          className="text-xs font-semibold text-[#0095f6] hover:underline"
        >
          Open
        </Link>
      </div>
      {entry.tags.length > 0 ? (
        <p className="mb-2 text-xs text-[#8e8e8e]">
          {entry.tags.map((t) => (
            <span key={t} className="mr-2">
              #{t}
            </span>
          ))}
        </p>
      ) : null}
      {sealedSelf ? (
        <div className="rounded-lg border border-dashed border-[#dbdbdb] bg-[#fafafa] p-4 text-sm text-[#8e8e8e]">
          <div className="mb-1 flex items-center gap-2 font-semibold text-[#262626]">
            <Clock className="h-4 w-4" />
            Unlocks for you
          </div>
          {entry.unlockAt ? (
            <p>
              {new Date(entry.unlockAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          ) : null}
        </div>
      ) : (
        <>
          {showTimedBanner ? (
            <p className="mb-2 rounded-md bg-[#fff4e5] px-2 py-1.5 text-xs text-[#b26a00]">
              {entry.timedAudience === "individual" ? (
                <>
                  Scheduled for one person
                  {entry.individualRelease
                    ? ` (${describeIndividualRelease(entry.individualRelease)})`
                    : ""}
                  {" — "}
                </>
              ) : (
                <>Scheduled for others — </>
              )}
              unlocks{" "}
              {entry.unlockAt
                ? new Date(entry.unlockAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : ""}
            </p>
          ) : null}
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#262626]">
            {entry.body}
          </p>
        </>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#8e8e8e]">
        <time dateTime={entry.createdAt}>
          {new Date(entry.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>
        {entry.unlockAt && entry.timedAudience !== "none" ? (
          <span className="rounded-full bg-[#fff4e5] px-2 py-0.5 text-[#b26a00]">
            Timed
            {!isPastOrNow(entry.unlockAt) ? " · sealed" : " · released"}
          </span>
        ) : null}
      </div>
    </article>
  );
}
