"use client";

import { useMemo } from "react";
import { EntryCard } from "@/components/entry-card";
import { useJournal } from "@/components/journal-provider";
import { PromptSection } from "@/components/prompt-section";

export function HomeFeed() {
  const { state, hydrated } = useJournal();

  const sorted = useMemo(() => {
    return [...state.entries].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [state.entries]);

  if (!hydrated) {
    return (
      <div className="py-12 text-center text-sm text-[#8e8e8e]">Loading…</div>
    );
  }

  return (
    <div>
      <div className="mb-8 border-b border-[#efefef] pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[#262626]">
          Your journal
        </h1>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[#8e8e8e]">
          Private by default. Share with circles or the world when you choose —
          including on a schedule.
        </p>
      </div>
      <PromptSection />
      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#dbdbdb] bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-[#262626]">
            Nothing here yet
          </p>
          <p className="mt-2 text-sm text-[#8e8e8e]">
            Write your first entry — it stays on this browser until you add sync
            and sign-in.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#efefef] bg-white shadow-sm">
          {sorted.map((e) => (
            <EntryCard key={e.id} entry={e} variant="owner" />
          ))}
        </div>
      )}
    </div>
  );
}
