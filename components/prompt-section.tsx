"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { promptWithOffset } from "@/lib/prompts";

export function PromptSection() {
  const [offset, setOffset] = useState(0);
  const text = useMemo(() => promptWithOffset(offset), [offset]);
  const href = `/compose?prompt=${encodeURIComponent(text)}`;

  return (
    <section
      className="mb-8 rounded-xl border border-[#efefef] bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="prompt-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="prompt-heading"
            className="text-xs font-semibold uppercase tracking-wide text-[#8e8e8e]"
          >
            Prompt
          </h2>
          <p className="mt-2 text-[17px] leading-relaxed text-[#262626]">
            {text}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-lg bg-[#0095f6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1877d2]"
        >
          Write with this prompt
        </Link>
        <button
          type="button"
          onClick={() => setOffset((o) => o + 1)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#dbdbdb] bg-[#fafafa] px-3 py-2 text-sm font-medium text-[#262626] hover:bg-[#efefef]"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Another prompt
        </button>
      </div>
    </section>
  );
}
