"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const nav: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/circles", label: "Circles" },
  { href: "/family", label: "Family" },
  { href: "/profile", label: "Profile" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-col bg-[#fafafa] text-[#262626]">
      <header className="sticky top-0 z-40 border-b border-[#dbdbdb] bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="shrink-0 text-lg font-semibold tracking-tight text-[#262626]"
          >
            Journalmax
          </Link>
          <nav
            className="hidden items-center gap-1 sm:flex sm:flex-1 sm:justify-center"
            aria-label="Main"
          >
            {nav.map(({ href, label }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-[#262626]"
                      : "text-[#8e8e8e] hover:text-[#262626]"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/compose"
              className="rounded-md bg-[#0095f6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1877d2]"
            >
              Write
            </Link>
          </div>
        </div>
        <nav
          className="flex border-t border-[#efefef] px-2 py-2 sm:hidden"
          aria-label="Main"
        >
          <div className="mx-auto flex max-w-5xl flex-1 justify-around">
            {nav.map(({ href, label }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-md px-2 py-1.5 text-xs font-medium ${
                    active ? "text-[#262626]" : "text-[#8e8e8e]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
