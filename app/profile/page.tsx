"use client";

import Link from "next/link";
import { useJournal } from "@/components/journal-provider";

export default function ProfilePage() {
  const { profile, updateProfile, hydrated } = useJournal();
  const publicPath = `/p/${encodeURIComponent(profile.username)}`;

  if (!hydrated) {
    return (
      <div className="px-4 py-8 text-center text-sm text-[#8e8e8e]">Loading…</div>
    );
  }

  return (
    <div className="rounded-xl border border-[#efefef] bg-white shadow-sm">
      <div className="border-b border-[#efefef] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-[#dbdbdb] bg-[#fafafa] text-2xl font-semibold text-[#262626]">
            {profile.displayName.slice(0, 1).toUpperCase()}
          </div>
          <h1 className="text-xl font-semibold text-[#262626]">
            {profile.displayName}
          </h1>
          <p className="text-sm text-[#8e8e8e]">@{profile.username}</p>
        </div>
      </div>
      <div className="space-y-6 px-5 py-8 sm:px-8">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8e8e8e]">
            Display name
          </span>
          <input
            value={profile.displayName}
            onChange={(e) => updateProfile({ displayName: e.target.value })}
            className="w-full rounded-lg border border-[#dbdbdb] px-3 py-2 text-[15px]"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8e8e8e]">
            Username (public URL)
          </span>
          <input
            value={profile.username}
            onChange={(e) =>
              updateProfile({
                username: e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9_]/g, ""),
              })
            }
            className="w-full rounded-lg border border-[#dbdbdb] px-3 py-2 text-[15px]"
          />
          <span className="mt-1 block text-xs text-[#8e8e8e]">
            Path:{" "}
            <Link href={publicPath} className="font-semibold text-[#0095f6]">
              {publicPath}
            </Link>
          </span>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8e8e8e]">
            Bio
          </span>
          <textarea
            value={profile.bio}
            onChange={(e) => updateProfile({ bio: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-[#dbdbdb] px-3 py-2 text-[15px]"
            placeholder="A line for visitors to your public journal."
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-[#efefef] px-3 py-3">
          <div>
            <p className="text-sm font-semibold text-[#262626]">
              Public autobiography
            </p>
            <p className="text-xs text-[#8e8e8e]">
              Show dated public entries on your page (like a living memoir).
            </p>
          </div>
          <input
            type="checkbox"
            checked={profile.publicAutobiography}
            onChange={(e) =>
              updateProfile({ publicAutobiography: e.target.checked })
            }
            className="h-5 w-5 accent-[#0095f6]"
          />
        </label>
        <div className="rounded-lg border border-dashed border-[#dbdbdb] bg-[#fafafa] px-3 py-4">
          <p className="text-sm font-semibold text-[#262626]">AI (coming soon)</p>
          <p className="mt-1 text-xs text-[#8e8e8e]">
            Connect your models later for thematic echoes across the community
            and gentle reflection from your own past entries.
          </p>
          <label className="mt-3 flex items-center justify-between gap-3 opacity-50">
            <span className="text-sm text-[#262626]">Similar themes opt-in</span>
            <input type="checkbox" disabled className="h-5 w-5" />
          </label>
          <label className="mt-2 flex items-center justify-between gap-3 opacity-50">
            <span className="text-sm text-[#262626]">Reflection companion</span>
            <input type="checkbox" disabled className="h-5 w-5" />
          </label>
        </div>
        <p className="text-center text-xs text-[#8e8e8e]">
          Sign-in and syncing will replace local-only storage here.
        </p>
      </div>
    </div>
  );
}
