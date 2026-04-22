"use client";

import { useState } from "react";
import { useJournal } from "@/components/journal-provider";

export default function FamilyPage() {
  const { state, upsertFamily, removeFamily, hydrated } = useJournal();
  const [displayName, setDisplayName] = useState("");
  const [relation, setRelation] = useState("");
  const [generationLabel, setGenerationLabel] = useState("");
  const [linkedToId, setLinkedToId] = useState<string>("");

  function add() {
    if (!displayName.trim()) return;
    upsertFamily({
      displayName: displayName.trim(),
      relation: relation.trim() || "Family",
      generationLabel: generationLabel.trim() || undefined,
      linkedToId: linkedToId || null,
    });
    setDisplayName("");
    setRelation("");
    setGenerationLabel("");
    setLinkedToId("");
  }

  if (!hydrated) {
    return (
      <div className="px-4 py-8 text-center text-sm text-[#8e8e8e]">Loading…</div>
    );
  }

  return (
    <div className="bg-white">
      <div className="border-b border-[#efefef] px-4 py-4">
        <h1 className="text-lg font-semibold text-[#262626]">Across generations</h1>
        <p className="mt-1 text-sm text-[#8e8e8e]">
          Link people and generations so journals can connect over time. Full
          shared timelines arrive with accounts and permissions.
        </p>
      </div>
      <div className="space-y-3 px-4 py-4">
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Name or nickname"
          className="w-full rounded-lg border border-[#dbdbdb] px-3 py-2 text-[15px]"
        />
        <input
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          placeholder="Relation (e.g. Mom, son)"
          className="w-full rounded-lg border border-[#dbdbdb] px-3 py-2 text-[15px]"
        />
        <input
          value={generationLabel}
          onChange={(e) => setGenerationLabel(e.target.value)}
          placeholder="Generation label (optional)"
          className="w-full rounded-lg border border-[#dbdbdb] px-3 py-2 text-[15px]"
        />
        <label className="block text-sm text-[#262626]">
          <span className="mb-1 block text-xs font-semibold text-[#8e8e8e]">
            Link to
          </span>
          <select
            value={linkedToId}
            onChange={(e) => setLinkedToId(e.target.value)}
            className="w-full rounded-lg border border-[#dbdbdb] px-3 py-2 text-[15px]"
          >
            <option value="">— none —</option>
            {state.family.map((f) => (
              <option key={f.id} value={f.id}>
                {f.displayName}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={add}
          className="w-full rounded-lg bg-[#0095f6] py-2 text-sm font-semibold text-white"
        >
          Add person
        </button>
      </div>
      <ul className="divide-y divide-[#efefef]">
        {state.family.map((f) => {
          const link = f.linkedToId
            ? state.family.find((x) => x.id === f.linkedToId)
            : null;
          return (
            <li key={f.id} className="px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[#262626]">{f.displayName}</p>
                  <p className="text-sm text-[#8e8e8e]">{f.relation}</p>
                  {f.generationLabel ? (
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#8e8e8e]">
                      {f.generationLabel}
                    </p>
                  ) : null}
                  {link ? (
                    <p className="mt-2 text-sm text-[#262626]">
                      Linked → {link.displayName}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => removeFamily(f.id)}
                  className="shrink-0 text-sm font-semibold text-[#ed4956]"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
