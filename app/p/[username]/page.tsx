"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { EntryCard } from "@/components/entry-card";
import { useJournal } from "@/components/journal-provider";
import { isPubliclyVisible } from "@/lib/time";

export default function PublicJournalPage() {
  const params = useParams();
  const raw = decodeURIComponent(String(params.username ?? ""));
  const { state, hydrated } = useJournal();

  const match = useMemo(() => {
    const u = state.profile.username.toLowerCase();
    return u === raw.toLowerCase();
  }, [state.profile.username, raw]);

  const entries = useMemo(() => {
    return state.entries
      .filter((e) => isPubliclyVisible(e))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [state.entries]);

  if (!hydrated) {
    return (
      <div className="px-4 py-8 text-center text-sm text-[#8e8e8e]">Loading…</div>
    );
  }

  if (!match) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-lg font-semibold text-[#262626]">No journal here</p>
        <p className="mt-2 text-sm text-[#8e8e8e]">
          This username does not match your profile on this device.
        </p>
        <Link href="/" className="mt-4 inline-block font-semibold text-[#0095f6]">
          Home
        </Link>
      </div>
    );
  }

  if (!state.profile.publicAutobiography) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-lg font-semibold text-[#262626]">This journal is private</p>
        <p className="mt-2 text-sm text-[#8e8e8e]">
          Turn on “Public autobiography” in Profile to share your dated public
          entries.
        </p>
        <Link href="/profile" className="mt-4 inline-block font-semibold text-[#0095f6]">
          Profile settings
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#efefef] bg-white shadow-sm">
      <div className="border-b border-[#efefef] px-5 py-8 text-center sm:px-8">
        <h1 className="text-xl font-semibold text-[#262626]">
          {state.profile.displayName}
        </h1>
        <p className="text-sm text-[#8e8e8e]">@{state.profile.username}</p>
        {state.profile.bio ? (
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#262626]">
            {state.profile.bio}
          </p>
        ) : null}
        <p className="mt-3 text-xs uppercase tracking-wide text-[#8e8e8e]">
          Living autobiography
        </p>
      </div>
      {entries.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-[#8e8e8e] sm:px-8">
          No public entries yet. Mark posts as Public to appear here after any
          scheduled time.
        </div>
      ) : (
        <div className="divide-y divide-[#efefef]">
          {entries.map((e) => (
            <EntryCard key={e.id} entry={e} variant="visitor" />
          ))}
        </div>
      )}
    </div>
  );
}
