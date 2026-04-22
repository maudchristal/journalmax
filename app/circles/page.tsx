"use client";

import { useState } from "react";
import { useJournal } from "@/components/journal-provider";

export default function CirclesPage() {
  const { state, upsertCircle, removeCircle, hydrated } = useJournal();
  const [name, setName] = useState("");
  const [members, setMembers] = useState("");
  const [notes, setNotes] = useState("");

  function add() {
    if (!name.trim()) return;
    const memberNames = members
      .split(/[,\n]+/)
      .map((m) => m.trim())
      .filter(Boolean);
    upsertCircle({ name: name.trim(), memberNames, notes: notes.trim() || undefined });
    setName("");
    setMembers("");
    setNotes("");
  }

  if (!hydrated) {
    return (
      <div className="px-4 py-8 text-center text-sm text-[#8e8e8e]">Loading…</div>
    );
  }

  return (
    <div className="bg-white">
      <div className="border-b border-[#efefef] px-4 py-4">
        <h1 className="text-lg font-semibold text-[#262626]">Close circles</h1>
        <p className="mt-1 text-sm text-[#8e8e8e]">
          Invite-only groups for family and friends. Accounts will map here when
          you add authentication.
        </p>
      </div>
      <div className="space-y-3 px-4 py-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Circle name"
          className="w-full rounded-lg border border-[#dbdbdb] px-3 py-2 text-[15px]"
        />
        <textarea
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          placeholder="People (comma or line separated)"
          rows={3}
          className="w-full rounded-lg border border-[#dbdbdb] px-3 py-2 text-[15px]"
        />
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="w-full rounded-lg border border-[#dbdbdb] px-3 py-2 text-[15px]"
        />
        <button
          type="button"
          onClick={add}
          className="w-full rounded-lg bg-[#0095f6] py-2 text-sm font-semibold text-white"
        >
          Add circle
        </button>
      </div>
      <ul className="divide-y divide-[#efefef]">
        {state.circles.map((c) => (
          <li key={c.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[#262626]">{c.name}</p>
                {c.memberNames.length > 0 ? (
                  <p className="mt-1 text-sm text-[#8e8e8e]">
                    {c.memberNames.join(" · ")}
                  </p>
                ) : null}
                {c.notes ? (
                  <p className="mt-2 text-sm text-[#262626]">{c.notes}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeCircle(c.id)}
                className="shrink-0 text-sm font-semibold text-[#ed4956]"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
